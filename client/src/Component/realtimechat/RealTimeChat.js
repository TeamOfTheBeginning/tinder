import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHome } from "react-icons/fa";

import "../../style/realtimechat/realtimechat.css";

import jaxios from '../../util/jwtUtil';

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
  const subscriptionRef = useRef([]);
  const navigate = useNavigate();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [userList, setUserList] = useState([]);

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
      const response = await jaxios.get(`${API_BASE_URL}/api/realtime-chatrooms/list`);
      // console.log("채팅방 목록 응답:", response.data);
      setChatRooms([...response.data]);
    } catch (error) {
      // console.error("채팅방 목록을 불러오는 중 오류 발생:", error);
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
      await jaxios.post(`${API_BASE_URL}/api/realtime-chatrooms/create`, null, {
        params: { name: newRoomName, isPrivate: Boolean(isPrivate), password, nickname },
      });          

      alert("채팅방이 생성되었습니다!");
      setNewRoomName("");
      fetchChatRooms();
    } catch (error) {
      // console.error("채팅방 생성 중 오류 발생:", error);
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
        const response = await jaxios.post(`${API_BASE_URL}/api/realtime-chatrooms/validate`, null, {
          params: { roomId: room.id, password: enteredPassword },
        });
  
        // console.log("🔑 비밀번호 검증 응답:", response.data);
  
        if (response.data.valid) {
          // console.log("✅ 비공개 채팅방 입장 성공!");
          enterChatRoom(room);
        } else {
          alert("비밀번호가 틀렸습니다!");
        }
      } catch (error) {
        // console.error("비밀번호 검증 중 오류 발생:", error);
        alert("비밀번호 검증 중 오류가 발생했습니다.");
      }
    } else {
      enterChatRoom(room);
    }
  };  

  const enterChatRoom = async (room) => {
    if (!room || !room.id) {
      // console.error("🚨 유효한 채팅방 정보가 없습니다. WebSocket 연결 중단.");
      alert("올바른 채팅방 정보를 확인하세요.");
      return;
    }
  
    setSelectedRoom(room);
    setMessages([]);
  
    if (stompClientRef.current) {
      // console.log("🔄 기존 WebSocket 연결 해제...");
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
  
    const socket = new SockJS(SOCKET_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { 
        nickname: nickname || "Guest", 
        roomId: room.id.toString()
      },
      reconnectDelay: 5000,
      // debug: (str) => console.log("🛜 [STOMP DEBUG]:", str),
      onConnect: async () => {
        // console.log("✅ WebSocket 연결 성공! 채팅방 ID:", room.id);
  
        if (subscriptionRef.current.length > 0) {
          subscriptionRef.current.forEach((sub) => sub.unsubscribe());
        }
        subscriptionRef.current = []; 
  
        // ✅ 메시지 구독
        subscriptionRef.current.push(
          stompClient.subscribe(`/topic/real_chat/${room.id}`, (message) => {
            if (message.body) {
              // console.log("📩 수신한 메시지:", message.body);
              const newMessage = JSON.parse(message.body);
              setMessages((prevMessages) => [...prevMessages, newMessage]);
            }
          })
        );
  
        // ✅ 접속 사용자 목록 구독 (변경이 있을 때만 업데이트)
        subscriptionRef.current.push(
          stompClient.subscribe(`/topic/chatroom/${room.id}/users`, (message) => {
            // console.log("👥 접속 사용자 목록 수신됨:", message.body);
            updateUserList(message.body);
          })
        );
  
        // ✅ 기존 접속자 목록 요청 (서버에서 수신)
        subscriptionRef.current.push(
          stompClient.subscribe(`/user/queue/chatroom/users`, (message) => {
            // console.log("🔄 기존 접속자 목록 수신:", message.body);
            updateUserList(message.body);
          })
        );
  
        // ✅ 서버에 기존 사용자 목록 요청
        try {
          const response = await jaxios.get(`${API_BASE_URL}/api/member/${room.id}/users`);
          // console.log("🔄 서버에서 받은 기존 사용자 목록:", response.data);
          setUserList(response.data);
        } catch (error) {
          // console.error("🚨 기존 사용자 목록 요청 중 오류 발생:", error);
        }
  
        stompClientRef.current = stompClient;
      },
      onStompError: (frame) => {
        // console.error("❌ STOMP 오류 발생:", frame);
        stompClient.deactivate();
      },
    });
  
    stompClient.activate();
  };
  
  const updateUserList = (data) => {
    try {
      let users = JSON.parse(data);
      if (!Array.isArray(users)) {
        // console.error("🚨 유효하지 않은 사용자 목록 데이터:", data);
        return;
      }
      users = users.filter(user => user && user.trim() !== ""); 
  
      setUserList((prevUserList) => {
        if (JSON.stringify(prevUserList) !== JSON.stringify(users)) {
          return users;
        }
        return prevUserList;
      });
  
    } catch (error) {
      // console.error("🚨 사용자 목록 JSON 파싱 오류:", error, data);
    }
  };
  
  const leaveRoom = () => {
    if (subscriptionRef.current.length > 0) {
      subscriptionRef.current.forEach((sub) => sub.unsubscribe()); // ✅ 모든 구독 해제
      subscriptionRef.current = [];
    }

    if (stompClientRef.current) {
      // console.log("🔌 WebSocket 연결 종료...");
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }

    setSelectedRoom(null);
    setMessages([]);
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
      // console.error("🚨 WebSocket이 연결되지 않음.");
      alert("서버와 연결이 끊어졌습니다. 다시 접속해주세요.");
      return;
    }
  
    const messageDto = { roomId: selectedRoom.id, content: message, nickname };
    // console.log("📤 메시지 전송:", messageDto);
  
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
      const response = await jaxios.delete(`${API_BASE_URL}/api/realtime-chatrooms/delete/${roomId}`, {
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
            실시간 채팅💬
            {
            // <FaHome 
            //  className="home-icon"
            //  onClick={() => navigate("/main")}
            //  title="메인으로 이동"
            // />
            }
          </h2>
          <div className="create-chat-room">
            <div id='create-header'>
              <input
                type="text"
                minlength='1' maxlength='100' 
                placeholder="채팅방 이름 (1글자 이상)"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
              <label>
                <input type="checkbox" checked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} />
                비공개
              </label>
            </div>
            <div className='btns'>
              <button onClick={createChatRoom}>채팅방 생성</button>
            </div>
          </div>
          {/* <h3>현재 개설된 채팅방</h3> */}
          <ul>
            {chatRooms.map((room) => (
              <li key={room.id}>
                <div className='sub-chatroom' onClick={() => joinChatRoom(room)}>
                  <div id='title'>
                  {room.name}
                  </div>
                  <div id='host'>{room.isPrivate ? "🌑 비공개" : "🌕 공개"} | ✏️ {room.creatorNickname}</div>
                  <div className='btns'>
                  {room.creatorNickname && room.creatorNickname === nickname && (
                    <button onClick={(e) => { 
                      e.stopPropagation();  // 🔥 이벤트 버블링 방지 
                      deleteChatRoom(room.id);
                    }}>
                      ❌ 삭제
                    </button>
                  )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="chat-room">
          <div className="chat-room-header">
            <h1>{selectedRoom.name}</h1>
            <span>😊 접속자: {userList.length}명</span>
            <div className="user-list">
              {userList.length > 0 ? userList.map((user, index) => (
                <span key={index} className="user-nickname">{user}</span>
              )) : <span className="no-user">현재 접속자가 없습니다.</span>}
            </div>
            <button className="leave-button" onClick={leaveRoom}>나가기</button>
          </div>

          <div className="chat-messages" ref={chatMessagesRef} onScroll={handleScroll}>
            {messages.map((msg, index) => {

              // 시스템 채팅
              if (msg.type === "SYSTEM") {
                return (
                  <div key={index} className="system-message">
                    <strong>{msg.content}</strong>
                  </div>
                );
              }

              // 일반 채팅
              const imageUrl = msg.profileImg && msg.profileImg.trim() !== ""
              ? msg.profileImg.startsWith("http")
                ? msg.profileImg
                : msg.profileImg.startsWith("/userimg")
                ? `${API_BASE_URL}${msg.profileImg}`
                : `${API_BASE_URL}/userimg/${msg.profileImg}`
                : `${API_BASE_URL}/userimg/default.jpg`; // 기본 이미지 적용                   
  
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
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>전송</button>
          </div>
        </div>
      )}
    </div>
  );  
}

export default ChatPage;
