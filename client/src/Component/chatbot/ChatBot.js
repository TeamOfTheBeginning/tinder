import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../../style/chatbot/chatbot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatContainerRef = useRef(null);

  const [userId] = useState(() => {
    let storedUserId = localStorage.getItem("chatbotUserId");
    if (!storedUserId) {
      storedUserId = `user-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("chatbotUserId", storedUserId);
    }
    return storedUserId;
  });

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:8070/api/chatbot/history/${userId}`);
        if (response.data && response.data.history) {
          setMessages(response.data.history);
        } else {
          setMessages([
            { role: "assistant", content: "안녕하세요! 무엇을 도와드릴까요?" }
          ]);
        }
      } catch (error) {
        console.error("이전 대화 기록을 불러오지 못했습니다.", error);
        setMessages([
          { role: "assistant", content: "안녕하세요! 무엇을 도와드릴까요?" }
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

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post(`http://localhost:8070/api/chatbot/ask/${userId}`, {
        message: input,
      });

      if (response.data.reply) {
        setMessages([...newMessages, { role: "assistant", content: response.data.reply }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "죄송합니다. 응답을 받을 수 없습니다." }]);
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
          </div>
        ))}
      </div>
      <div className="chatbot-input-container">
        <input
          type="text"
          className="chatbot-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="메시지를 입력하세요..."
        />
        <button className="chatbot-send" onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default ChatBot;
