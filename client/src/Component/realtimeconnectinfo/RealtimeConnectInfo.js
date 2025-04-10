import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { FaUser } from "react-icons/fa";
import { IoIosContact } from "react-icons/io";

import "../../style/realtimeconnectinfo/realtimeconnectinfo.css";

import jaxios from '../../util/jwtUtil';

//웹소켓 경로 관련
const isLocalhost = window.location.hostname === "localhost" ;
// || window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocalhost
  ? "http://localhost:8070" // 로컬 개발 환경
  : `http://${window.location.hostname}:8470`; // 클라이언트가 실행 중인 네트워크 기반으로 서버 IP 설정

const SOCKET_URL = `${API_BASE_URL}/ws_real_chat`;

const RealtimeConnectInfo = () => {


  const [userCount, setUserCount] = useState(0);
  const [userNames, setUserNames] = useState();
  const [client, setClient] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // WebSocket 클라이언트 설정
    const stompClient = new Client({
      brokerURL: `ws://${API_BASE_URL}/ws_real_chat`,
      // brokerURL: 'ws://localhost:8070/ws_real_chat',  
      // // 서버의 WebSocket 엔드포인트
      connectHeaders: {
        // 필요한 경우 인증 정보 추가
      },
      debug: function (str) {
        // console.log(str);
      },
      onConnect: () => {
        // console.log('WebSocket connected');
    
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
        // console.log(parsedMessage.usernames)

        setUserNames(parsedMessage.usernames);
        });
      },
      onDisconnect: () => {
        // console.log('WebSocket disconnected');
      },
      onStompError: (frame) => {
        // console.error('STOMP error: ', frame);
      },
      webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws_real_chat`),
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient) {
        stompClient.deactivate();  // 클린업: 컴포넌트가 언마운트될 때 WebSocket 연결 종료
      }
    };
  }, []);

  function toggle(){
    setIsOpen(!isOpen);
  }

  return (
    <div className='realtimeConnectInfoContainer'>
      <div 
      className='realtimeConnectInfoContent' 
      data-ignore-click="true" 
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={()=>toggle()}
      >
      <IoIosContact id='IoIosContact'/>
      {/* // <FaUser id='FaUser'/> */}
      
      {showTooltip && (
        <div 
          style={{
            // position: 'absolute',
            // bottom: '70%',
            // left: '50%',
            // transform: 'translateX(-50%)',
            background: 'black',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
          }}

          id='userCount'
        >
          {userCount}
        </div>
      )}

      {isOpen && (<div className='realTimeAccessUserList'>
        {(userNames)?(userNames.map((userName, idx)=>{
          return (
            <div key={idx}>
              {userName.member.nickname}&nbsp;
            </div>
          )
        })):("접속한유저가 없습니다.")}
        </div>
      )}
      </div>
      
    </div>
  )
}

export default RealtimeConnectInfo
