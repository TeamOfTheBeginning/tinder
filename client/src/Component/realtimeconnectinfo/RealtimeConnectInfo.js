import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { FaUser } from "react-icons/fa";

import "../../style/realtimeconnectinfo/realtimeconnectinfo.css";

const RealtimeConnectInfo = () => {


  const [userCount, setUserCount] = useState(0);
  const [client, setClient] = useState(null);

  useEffect(() => {
    // WebSocket 클라이언트 설정
    const stompClient = new Client({
      brokerURL: 'ws://localhost:8070/ws',  // 서버의 WebSocket 엔드포인트
      connectHeaders: {
        // 필요한 경우 인증 정보 추가
      },
      debug: function (str) {
        console.log(str);
      },
      onConnect: () => {
        console.log('WebSocket connected');
        stompClient.subscribe('/topic/userCount', (message) => {
          setUserCount(parseInt(message.body));  // 서버에서 받은 접속자 수 업데이트
        });
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
      },
      onStompError: (frame) => {
        console.error('STOMP error: ', frame);
      },
      webSocketFactory: () => new SockJS('http://localhost:8070/ws_real_chat'),
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient) {
        stompClient.deactivate();  // 클린업: 컴포넌트가 언마운트될 때 WebSocket 연결 종료
      }
    };
  }, []);

  // // 사용자가 접속하거나 퇴장하는 메서드
  // const handleJoin = (username) => {
  //   client.publish({ destination: '/app/join', body: JSON.stringify({ username }) });
  // };

  // const handleLeave = (username) => {
  //   client.publish({ destination: '/app/leave', body: JSON.stringify({ username }) });
  // };








  return (
    <div className='realtimeConnectInfoContainer'>
       <div className='realtimeConnectInfoContent'><FaUser />:{userCount}</div>
    </div>
  )
}

export default RealtimeConnectInfo
