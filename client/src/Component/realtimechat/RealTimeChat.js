import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom";

import '../../style/realtimechat/realtimechat.css';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://192.168.0.44:8070/ws_real_chat";


function ChatPage() {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const stompClientRef = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    if (!storedNickname) {
      alert("로그인이 필요합니다.");
      navigate("/");
      return;
    }
    setNickname(storedNickname);

    connectWebSocket(storedNickname);

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [navigate]);

  const connectWebSocket = (nickname) => {
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
            setMessages((prevMessages) => [...prevMessages, JSON.parse(message.body)]);
          }
        });
      },
      onStompError: (e) => {
        stompClient.deactivate();
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;
  };

  const sendMessage = () => {
    if (!message.trim() || !stompClientRef.current || !stompClientRef.current.connected) {
      return;
    }

    const messageDto = {
      content: message,
      nickname: nickname,
    };

    stompClientRef.current.publish({
      destination: "/app/real_chat",
      body: JSON.stringify(messageDto),
    });

    setMessage("");
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.nickname === nickname ? "self" : "other"}`}
          >
            <strong>{msg.nickname}: </strong>
            {msg.content}
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
