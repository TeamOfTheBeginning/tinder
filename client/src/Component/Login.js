import React, {useState, useEffect} from 'react'
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { loginAction, setFollower, setFollowed } from '../store/userSlice';
import {Cookies} from 'react-cookie'

import '../style/mystargram.css'
import '../style/login.css'
import { IoLogIn, IoCreateOutline } from "react-icons/io5";

import RealtimeConnectInfo from './realtimeconnectinfo/RealtimeConnectInfo';
 


const Login = () => {
    const [email, setEmail]=useState('')
    const [pwd, setPwd]=useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const cookies = new Cookies()

    async function onLoginLocal(){
        if( !email ){ return alert('이메일을 입력하세요')}
        if( !pwd ){ return alert('비밀번호를 입력하세요')}
        try{
            const result = await axios.post('/api/member/loginlocal', null ,{ params:{email, pwd} })
            // console.log("1")
            // console.log(result)
            
            if( result.data.msg == 'ok'){

                const res = await axios.get('/api/member/getLoginUser');
                const lUser = res.data.loginUser;
                
                lUser['follower'] = res.data.follower;
                lUser['followed'] = res.data.followed;
                cookies.set('user', JSON.stringify( lUser ) , {path:'/', })
                
                cookies.set('follower', JSON.stringify( res.data.follower ) , {path:'/', })
                cookies.set('followed', JSON.stringify( res.data.followed ) , {path:'/', })
                
                dispatch( loginAction( res.data.loginUser ) )
                dispatch( setFollower( res.data.follower ) )
                dispatch( setFollowed( res.data.followed ) )

                handleJoin(lUser.memberId)

                localStorage.setItem("nickname", lUser.nickname);
                navigate('/main');
            }else{
              setPwd("");
              return alert(result.data.msg);
            }
        }catch(err){ console.error(err)}
    }

    const [userCount, setUserCount] = useState();
    const [client, setClient] = useState(null);

    useEffect(() => {
        // WebSocket 클라이언트 설정
        const stompClient = new Client({
          brokerURL: 'ws://localhost:8070/ws_real_chat',  // 서버의 WebSocket 엔드포인트
          connectHeaders: {
            // 필요한 경우 인증 정보 추가
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
            // alert(message.body);

            const parsedMessage = JSON.parse(message.body);

            // console.log("parsedMessage"+parsedMessage)
            
            // console.log("parsedMessage.userCount"+parsedMessage.userCount)

            const userCount = Number(parsedMessage.userCount);

            setUserCount(userCount);

            // setUserCount(parseInt(message.body.userCount));  // 서버에서 받은 접속자 수 업데이트
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

 // 사용자가 접속하거나 퇴장하는 메서드
  const handleJoin = (memberId) => {
    client.publish({ destination: '/app/join', body: JSON.stringify({ memberId }) });
  };

    return (
        <div className='container'>
          <div className='loginform'>

              <RealtimeConnectInfo />

              <div className='field'>
                  <label>EMAIL</label>
                  <input type="text" value={email} onChange={(e)=>{ setEmail(e.currentTarget.value)}} />
              </div>        
              <div className='field'>
                  <label>PASSWORD</label>
                  <input type="password" value={pwd} onChange={(e)=>{ setPwd(e.currentTarget.value)}} />
              </div>        
              <div className='btns'>
                  <div id="btn" onClick={()=>{onLoginLocal(); }}><IoLogIn />&nbsp;LOGIN</div>
                  <div id="btn" onClick={()=>{navigate('/joinForm')}}><IoCreateOutline />&nbsp;JOIN</div>
              </div>
              <div className='snslogin'>
                  <button id="kakao" onClick={
                      ()=>{
                          window.location.href='http://localhost:8070/member/kakaostart';
                      }
                  }>카카오로 시작하기</button>
              </div>
          </div>
        </div>
        
    )
}

export default Login
