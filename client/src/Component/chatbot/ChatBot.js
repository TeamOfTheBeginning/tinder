import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/chatbot/chatbot.css";

import jaxios from '../../util/jwtUtil';

export const API_BASE_URL = `http://1.215.146.37:8390`;

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/chatbot") {
        navigate("/");
    }
  }, [navigate]);

  const [userId] = useState(() => {
    let storedUserId = localStorage.getItem("chatbotUserId");
    if (!storedUserId) {
      storedUserId = `user-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("chatbotUserId", storedUserId);
    }
    return storedUserId;
  });

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await jaxios.get(`${API_BASE_URL}/api/chatbot/history/${userId}`);
        if (response.data && response.data.history) {
          setMessages(response.data.history);
        } else {
          setMessages([
            {
              role: "assistant",
              content: "안녕하세요! 무엇을 도와드릴까요?",
              buttons: ["조언받기", "계정문의", "기타문의", "친구찾기", "실시간 고객센터 연결"]
            }
          ]);
        }
      } catch (error) {
        console.error("이전 대화 기록을 불러오지 못했습니다.", error);
        setMessages([
          {
            role: "assistant",
            content: "안녕하세요! 무엇을 도와드릴까요?",
            buttons: ["조언받기", "계정문의", "기타문의", "친구찾기", "실시간 고객센터 연결"]
          }
        ]);
      }
    };

    fetchChatHistory();
  }, [userId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (message) => {
    if (!message.trim()) return;
  
    setMessages((prevMessages) => [...prevMessages, { role: "user", content: message }]);
    setInput(""); // ✅ 입력창 초기화
  
    // "답변을 작성 중..." 메시지를 추가하고, 해당 인덱스를 추적
    const typingMessage = { role: "assistant", content: "답변을 작성 중..." };
    setMessages((prevMessages) => [...prevMessages, typingMessage]);
  
    try {
      const response = await jaxios.post(`${API_BASE_URL}/api/chatbot/ask/${userId}`, { message });
  
      if (response.data.reply) {
        setMessages((prevMessages) => 
          prevMessages.map((msg, index) => 
            index === prevMessages.length - 1 ? { role: "assistant", content: response.data.reply } : msg
          )
        );
      }
    } catch (error) {
      setMessages((prevMessages) => 
        prevMessages.map((msg, index) => 
          index === prevMessages.length - 1 ? { role: "assistant", content: "죄송합니다. 응답을 받을 수 없습니다." } : msg
        )
      );
    }
  };  

  return (
    <div className="chatbot-container">
      <h2 className="chatbot-header">ChatBot</h2>
      <div className="chatbot-messages" ref={chatContainerRef}>
        {messages.map((msg, index) => (
            <div key={index} className={`chatbot-message ${msg.role}`}>
              <span className="chatbot-text">
                {msg.content.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </span>
              {msg.buttons && (
              <div className="chatbot-buttons-container">
                {msg.buttons.map((btn, idx) => (
                  <button
                    key={idx}
                    className="chatbot-option-button"
                    onClick={() => {
                      if (btn === "실시간 고객센터 연결") {
                        window.open("http://pf.kakao.com/_KZtxjn/chat", "_blank");
                      } else {
                        sendMessage(btn);
                        setInput("");
                      }
                    }}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="chatbot-input-container">
        <input
          type="text"
          className="chatbot-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="메시지를 입력하세요..."
        />
        <button className="chatbot-send" onClick={() => sendMessage(input)}>전송</button>
      </div>
    </div>
  );
};

export default ChatBot;
