import React, { useState } from "react";
import axios from "axios";

import "../../style/chatbot/chatbot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post("http://localhost:8070/api/chatbot/ask", {
        message: input,
      });

      setMessages([...newMessages, { role: "assistant", content: response.data.reply }]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    }
  };

  // return (
  //   <div style={{ maxWidth: "400px", margin: "20px auto", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
  //     <h2>ChatBot</h2>
  //     <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ddd", padding: "5px", marginBottom: "10px" }}>
  //       {messages.map((msg, index) => (
  //         <div key={index} style={{ textAlign: msg.role === "user" ? "right" : "left", margin: "5px 0" }}>
  //           <strong>{msg.role === "user" ? "You" : "ChatBot"}: </strong>{msg.content}
  //         </div>
  //       ))}
  //     </div>
  //     <input
  //       type="text"
  //       value={input}
  //       onChange={(e) => setInput(e.target.value)}
  //       onKeyPress={(e) => e.key === "Enter" && sendMessage()}
  //       style={{ width: "80%", padding: "5px" }}
  //     />
  //     <button onClick={sendMessage} style={{ width: "18%", padding: "5px" }}>Send</button>
  //   </div>
  // );
};

export default ChatBot;
