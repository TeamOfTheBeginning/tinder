import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URL = "http://localhost:8070/ws_real_chat";

function ChatPage() {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const stompClientRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const enteredNickname = prompt("닉네임을 입력하세요");
    if (!enteredNickname || enteredNickname.trim() === "") {
      alert("닉네임을 입력해야 합니다.");
      window.location.reload();
      return;
    }
    setNickname(enteredNickname);

    connectWebSocket(enteredNickname);

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate().then(() => {
          console.log("[STOMP] 연결 해제 완료");
        });
      }
    };
  }, []);

  const connectWebSocket = (nickname) => {
    console.log("[STOMP] WebSocket 연결 시도...");

    const socket = new SockJS(SOCKET_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { nickname },
      debug: (msg) => console.log("[STOMP]:", msg),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("[STOMP] 연결 성공");
        
        stompClient.subscribe("/topic/real_chat", (message) => {
          if (message.body) {
            console.log("[STOMP] 메시지 수신:", message.body);
            setMessages((prevMessages) => [...prevMessages, JSON.parse(message.body)]);
          }
        });
      },
      onStompError: (e) => {
        console.error("[STOMP] 연결 실패:", e);
        stompClient.deactivate();
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;
  };

  const sendMessage = () => {
    if (!message.trim() || !stompClientRef.current || !stompClientRef.current.connected) {
      console.warn("[STOMP] 연결이 끊어져 있어 메시지를 전송할 수 없습니다.");
      return;
    }

    const messageDto = {
      content: message,
      nickname: nickname,
    };

    console.log("[STOMP] 메시지 전송: ", messageDto);

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

  return (
    <div className="flex justify-center w-screen h-screen">
      <div className="flex flex-col max-w-screen-sm w-full h-full bg-neutral-50">
        <div className="p-4 font-bold text-xl bg-neutral-200 flex justify-center">
          채팅방 - {nickname}
        </div>
        <div className="flex-1 overflow-auto p-4">
          {messages.map((msg, index) => (
            <div key={index} className="p-2 my-1 rounded-lg w-fit bg-white shadow-md">
              <b>{msg.nickname || "익명"}</b>: {msg.content}
            </div>
          ))}
        </div>
        <div className="p-4 bg-neutral-200 flex items-center w-full">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 p-3 rounded-lg mr-2 border border-gray-300"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="메시지를 입력하세요..."
          />
          <button className="p-3 bg-neutral-900 text-white rounded-lg" onClick={sendMessage}>
            전송
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
