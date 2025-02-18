import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHome } from "react-icons/fa";

import "../../style/realtimechat/realtimechat.css";

const isLocalhost = window.location.hostname === "localhost" ;
// || window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocalhost
  ? "http://localhost:8070" // 로컬 개발 환경
  : `http://${window.location.hostname}:8070`; // 클라이언트가 실행 중인 네트워크 기반으로 서버 IP 설정

const SOCKET_URL = `${API_BASE_URL}/ws_real_chat`;


function ChatPage() {
  const storedNickname = localStorage.getItem("nickname") || "";
  const [nickname, setNickname] = useState(storedNickname);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoomName, setNewRoomName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const messageEndRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const stompClientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const navigate = useNavigate();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const navigateWithinSideViewer = (path) => {
    navigate(path); // 경로 이동만 수행하고 SideViewer 상태는 유지
  };
  

  useEffect(() => {
    if (!nickname) {
      alert("로그인이 필요합니다.");
      navigate("/");
    } else {
      fetchChatRooms();
    }

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.deactivate();
      }
    };    
  }, [navigate, nickname]);

  const fetchChatRooms = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/realtime-chatrooms/list`);
      console.log("채팅방 목록 응답:", response.data);
      setChatRooms([...response.data]);
    } catch (error) {
      console.error("채팅방 목록을 불러오는 중 오류 발생:", error);
    }
  };
  
  const createChatRoom = async () => {
    if (!newRoomName.trim()) {
      alert("채팅방 이름을 입력하세요!");
      return;
    }

    let password = "";
    if (isPrivate) {
      password = prompt("비공개방 비밀번호를 입력하세요:");
      if (!password) {
        alert("비밀번호를 입력해야 합니다.");
        return;
      }
    }

    try {
      await axios.post(`${API_BASE_URL}/api/realtime-chatrooms/create`, null, {
        params: { name: newRoomName, isPrivate: Boolean(isPrivate), password, nickname },
      });          

      alert("채팅방이 생성되었습니다!");
      setNewRoomName("");
      fetchChatRooms();
    } catch (error) {
      console.error("채팅방 생성 중 오류 발생:", error);
    }
  };

  const joinChatRoom = async (room) => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }
  
    if (room.isPrivate) {
      const enteredPassword = prompt("비공개 채팅방의 비밀번호를 입력하세요:");
      if (!enteredPassword) {
        alert("비밀번호를 입력해야 합니다.");
        return;
      }
  
      try {
        const response = await axios.post(`${API_BASE_URL}/api/realtime-chatrooms/validate`, null, {
          params: { roomId: room.id, password: enteredPassword },
        });
  
        console.log("🔑 비밀번호 검증 응답:", response.data);
  
        if (response.data.valid) {
          console.log("✅ 비공개 채팅방 입장 성공!");
          enterChatRoom(room);
        } else {
          alert("비밀번호가 틀렸습니다!");
        }
      } catch (error) {
        console.error("비밀번호 검증 중 오류 발생:", error);
        alert("비밀번호 검증 중 오류가 발생했습니다.");
      }
    } else {
      enterChatRoom(room);
    }
  };  


  const enterChatRoom = (room) => {
    setSelectedRoom(room);
    setMessages([]);
  
    if (stompClientRef.current) {
      console.log("🔄 기존 WebSocket 연결 해제...");
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
  
    const socket = new SockJS(SOCKET_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { nickname },
      reconnectDelay: 5000,
      debug: (str) => console.log("🛜 [STOMP DEBUG]:", str), // 디버깅 로그 추가
      onConnect: () => {
        console.log("✅ WebSocket 연결 성공! 채팅방 ID:", room.id);
  
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
  
        const subscription = stompClient.subscribe(`/topic/real_chat/${room.id}`, (message) => {
          if (message.body) {
            console.log("📩 수신한 메시지:", message.body);
            const newMessage = JSON.parse(message.body);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
  
            setTimeout(() => {
              if (messageEndRef.current) {
                messageEndRef.current.scrollIntoView({ behavior: "smooth" });
              }
            }, 100);
          }
        });
  
        subscriptionRef.current = subscription;
        stompClientRef.current = stompClient;
      },
      onStompError: (frame) => {
        console.error("❌ STOMP 오류 발생:", frame);
        stompClient.deactivate();
      },
    });
  
    stompClient.activate();
  };
  
  const leaveRoom = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
  
    if (stompClientRef.current) {
      console.log("🔌 WebSocket 연결 종료...");
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
  
    setSelectedRoom(null);
  };
  

  const chatMessageRef = useRef(null);
  const handleScroll = () => {
    if (!chatMessageRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatMessageRef.current;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 10;

    setIsAtBottom(atBottom);
  };

  const sendMessage = () => {
    if (!message.trim()) return;
  
    if (!stompClientRef.current || !stompClientRef.current.connected) {
      console.error("🚨 WebSocket이 연결되지 않음.");
      alert("서버와 연결이 끊어졌습니다. 다시 접속해주세요.");
      return;
    }
  
    const messageDto = { roomId: selectedRoom.id, content: message, nickname };
    console.log("📤 메시지 전송:", messageDto);
  
    stompClientRef.current.publish({
      destination: `/app/real_chat/${selectedRoom.id}`,
      body: JSON.stringify(messageDto),
    });
  
    setMessage("");
  };   

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const deleteChatRoom = async (roomId) => {
    if (!window.confirm("정말 이 채팅방을 삭제하시겠습니까?")) return;
  
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/realtime-chatrooms/delete/${roomId}`, {
        params: { nickname }
      });
  
      alert(response.data.message);
      fetchChatRooms();
    } catch (error) {
      alert(error.response?.data?.message || "채팅방 삭제 중 오류 발생");
    }
  };  

  return (
    <div className="chat-container">
      {!selectedRoom ? (
        <div className="chat-room-list">
          <h2>
            📢 채팅방 목록
            <FaHome 
              className="home-icon"
              onClick={() => navigate("/main")}
              title="메인으로 이동"
            />
          </h2>
          <ul>
            {chatRooms.map((room) => (
              <li key={room.id}>
                <button onClick={() => joinChatRoom(room)}>
                  {room.name} {room.isPrivate ? "(🔒 비공개)" : "(🌍 공개)"}
                </button>

                {room.creatorNickname && room.creatorNickname === nickname && (
                  <button onClick={() => deleteChatRoom(room.id)}>🗑 삭제</button>
                )}
              </li>
            ))}
          </ul>
          <div className="create-chat-room">
            <h3>새 채팅방 만들기</h3>
            <input
              type="text"
              placeholder="채팅방 이름 입력"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <label>
              <input type="checkbox" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} />
              비공개 채팅방
            </label>
            <button onClick={createChatRoom}>채팅방 생성</button>
          </div>
        </div>
      ) : (
        <div className="chat-room">
          <div className="chat-room-header">
            <h1>{selectedRoom.name}</h1>
            <button className="leave-button" onClick={leaveRoom}>나가기</button>
          </div>
  
          <div className="chat-messages" ref={chatMessagesRef} onScroll={handleScroll}>
            {messages.map((msg, index) => {
              const imageUrl = msg.profileImg && msg.profileImg.trim() !== ""
              ? msg.profileImg.startsWith("http")
                ? msg.profileImg
                : msg.profileImg.startsWith("/uploads")
                ? `${API_BASE_URL}${msg.profileImg}`
                : `${API_BASE_URL}/uploads/${msg.profileImg}`
                : `${API_BASE_URL}/uploads/default.jpg`; // 기본 이미지 적용                   
  
              return (
                <div key={index} className={`message ${msg.nickname === nickname ? "self" : "other"}`}>
                  <img src={imageUrl} alt="프로필" className="profile-img" />
                  <strong>{msg.nickname}: </strong> {msg.content}
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
  
          <div className="chat-input">
            <input
              type="text"
              placeholder="메시지를 입력하세요..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>전송</button>
          </div>
        </div>
      )}
    </div>
  );  
}

export default ChatPage;
