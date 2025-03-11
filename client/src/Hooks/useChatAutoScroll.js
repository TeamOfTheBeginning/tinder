import { useEffect, useRef } from "react";

const useChatAutoScroll = () => {
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 300); // 키보드 애니메이션 시간 고려
  };

  return { messageEndRef, scrollToBottom };
};

export default useChatAutoScroll;