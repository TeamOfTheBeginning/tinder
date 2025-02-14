import { useEffect, useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../../style/realtimechat/realtimechat.css";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://192.168.0.44:8070/ws_real_chat";
const MAX_MESSAGES = 100;

function ChatPage() {
  const storedNickname = localStorage.getItem("nickname") || "";
  const [nickname, setNickname] = useState(storedNickname);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [profileImgUrls, setProfileImgUrls] = useState({});
  const activeUsersRef = useRef(new Set());
  const stompClientRef = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!nickname) {
      alert("로그인이 필요합니다.");
      navigate("/");
    }
  }, [navigate, nickname]);

  const fetchProfileImage = useCallback(async (nickname) => {
    if (!nickname) return;

    setProfileImgUrls((prev) => {
      if (prev[nickname]) return prev;
      return { ...prev, [nickname]: "loading" };
    });

    try {
      const response = await axios.get(`http://localhost:8070/api/member/profile-img/${encodeURIComponent(nickname)}`);
      const imageName = response.data || "default.jpg";
      setProfileImgUrls((prev) => ({
        ...prev,
        [nickname]: `http://localhost:8070/uploads/${imageName}`
      }));
    } catch {
      setProfileImgUrls((prev) => ({
        ...prev,
        [nickname]: "http://localhost:8070/uploads/default.jpg"
      }));
    }
  }, []);

  useEffect(() => {
    if (!nickname) return;

    const socket = new SockJS(SOCKET_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { nickname },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        stompClient.subscribe("/topic/real_chat", (message) => {
          if (message.body) {
            const newMessage = JSON.parse(message.body);
            setMessages((prevMessages) => {
              const updatedMessages = [...prevMessages, newMessage];
              return updatedMessages.length > MAX_MESSAGES
                ? updatedMessages.slice(updatedMessages.length - MAX_MESSAGES)
                : updatedMessages;
            });

            fetchProfileImage(newMessage.nickname);
            activeUsersRef.current.add(newMessage.nickname);
          }
        });
      },
      onStompError: () => {
        stompClient.deactivate();
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [nickname, fetchProfileImage]);

  const sendMessage = () => {
    if (!message.trim() || !stompClientRef.current?.connected) return;

    const messageDto = { content: message, nickname };

    stompClientRef.current.publish({
      destination: "/app/real_chat",
      body: JSON.stringify(messageDto),
    });

    setMessage("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-h">
        <h1> 현재 접속 중인 사람: {Array.from(activeUsersRef.current).join(", ") || "없음"} </h1>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.nickname === nickname ? "self" : "other"}`}>
            {msg.type === "SYSTEM" ? (
              <div className="system-message">
                <strong>{msg.nickname}: </strong> {msg.content}
              </div>
            ) : (
              <div className="chat-bubble">
                <img
                  src={profileImgUrls[msg.nickname] || "http://localhost:8070/userImg/default.jpg"}
                  alt="profile"
                  width="40"
                  height="40"
                  style={{ borderRadius: "50%", marginRight: "10px" }}
                  onError={(e) => (e.target.src = "http://localhost:8070/userImg/default.jpg")}
                />
                <strong>{msg.nickname}: </strong> {msg.content}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          ref={inputRef}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
}

export default ChatPage;
