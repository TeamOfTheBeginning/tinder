import React, { useState } from "react";
import axios from "axios";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await axios.post("http://localhost:8070/api/chatbot/ask", {
        message: input,
      });

      const botMessage = { role: "bot", content: response.data.response };
      setMessages([...messages, userMessage, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...messages, userMessage, { role: "bot", content: "오류가 발생했습니다. 다시 시도해 주세요." }]);
    }

    setInput("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index} style={msg.role === "user" ? styles.userMessage : styles.botMessage}>
            {msg.content}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          placeholder="문의 사항을 입력하세요..."
        />
        <button onClick={sendMessage} style={styles.button}>전송</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "400px",
    margin: "auto",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    backgroundColor: "#f9f9f9"
  },
  chatBox: {
    height: "300px",
    overflowY: "scroll",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },
  userMessage: {
    alignSelf: "flex-end",
    background: "#007bff",
    color: "#fff",
    padding: "8px",
    borderRadius: "5px",
    maxWidth: "80%"
  },
  botMessage: {
    alignSelf: "flex-start",
    background: "#e5e5ea",
    padding: "8px",
    borderRadius: "5px",
    maxWidth: "80%"
  },
  inputContainer: {
    display: "flex",
    marginTop: "10px"
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px"
  },
  button: {
    marginLeft: "5px",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer"
  }
};

export default ChatBot;
