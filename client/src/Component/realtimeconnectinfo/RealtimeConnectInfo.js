import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { FaUser } from "react-icons/fa";

import "../../style/realtimeconnectinfo/realtimeconnectinfo.css";

const RealtimeConnectInfo = () => {


  const [userCount, setUserCount] = useState(0);
  const [userNames, setUserNames] = useState();
  const [client, setClient] = useState(null);

  useEffect(() => {
    // WebSocket 클라이언트 설정
    const stompClient = new Client({
      brokerURL: 'ws://localhost:8070/ws_real_chat',  // 서버의 WebSocket 엔드포인트
      connectHeaders: {
        // 필요한 경우 인증 정보 추가
      },
      debug: function (str) {
        // console.log(str);
      },
      onConnect: () => {
        console.log('WebSocket connected');
    
        // 서버에 접속자 수를 요청하는 메시지 발송
        stompClient.publish({
        destination: '/app/getUserCount',
        });

        // 서버로부터 접속자 수 업데이트를 실시간으로 받기 위해 구독
        stompClient.subscribe('/topic/real_chat/userCount', (message) => {
        // console.log("Received message:", message.body);

        const parsedMessage = JSON.parse(message.body);

        // console.log("parsedMessage"+parsedMessage)

        setUserCount(parsedMessage.userCount);

        // console.log("parsedMessage.usernames"+JSON.stringify(parsedMessage.usernames));

        // setUserCount(parseInt(message.body.userCount));  // 서버에서 받은 접속자 수 업데이트

        setUserNames(parsedMessage.usernames);
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

  return (
    <div className='realtimeConnectInfoContainer'>
      <div className='realtimeConnectInfoContent'><FaUser />:{userCount}<br/>

        {(userNames)?(userNames.map((userName, idx)=>{
                    return (
                        <div key={idx}>
                            {userName.username}&nbsp;
                        </div>
                    )
                })):("접속한유저가 없습니다.")}
      </div>
    </div>
  )
}

export default RealtimeConnectInfo
