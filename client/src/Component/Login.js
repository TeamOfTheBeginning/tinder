import React, {useState, useEffect} from 'react'
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginAction, setFollower, setFollowed } from '../store/userSlice';
import { Cookies } from 'react-cookie';
import { setCookie, getCookie } from '../util/cookieUtil';

import '../style/login.css';
import { IoLogIn, IoCreateOutline } from 'react-icons/io5';
import RealtimeConnectInfo from './realtimeconnectinfo/RealtimeConnectInfo';
import JoinForm from "./member/JoinForm";
import { SiOutline } from 'react-icons/si';

const Login = () => {
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [isSignUp, setIsSignUp] = useState(false); // Sign In / Sign Up 전환 상태
    const navigate = useNavigate('');
    const dispatch = useDispatch('');
    const cookies = new Cookies('');

    async function onLoginLocal(){
        if( !email ){ return alert('이메일을 입력하세요')}
        if( !pwd ){ return alert('비밀번호를 입력하세요')}
        try{
            const result = await axios.post('/api/member/loginlocal', null ,{ params:{username:email, password:pwd} })
            // console.log("1")
            // console.log(result)

            if( result.data.error === 'ERROR_LOGIN'){
                setPwd("");
                return alert('이메일과 패스워드를 확인하세요')
            }else{              
                console.log("result.data"+JSON.stringify( result.data ))

                // cookies.set('user', JSON.stringify( result.data ) , {path:'/', })

                setCookie( 'user', JSON.stringify(result.data) , 1)

                // setCookie( 'accessToken', JSON.stringify(result.data.accessToken) , 1)

                // setCookie( 'refreshToken', JSON.stringify(result.data.refreshToken) , 1)

                const loginUserStr = JSON.stringify(result.data);
                // 문자열 길이 계산
                const sizeInBytes = new TextEncoder().encode(loginUserStr).length;

                console.log(sizeInBytes); // 바이트 단위로 크기 출력
                console.log(sizeInBytes / 1024 / 1024); // MB 단위로 크기 출력
                
                

                dispatch( loginAction( result.data ) )
                // navigate('/main');

                // const res = await axios.get('/api/member/getLoginUser');
                // const lUser = result.data.loginUser;

                // lUser['follower'] = result.data.follower;
                // lUser['followed'] = result.data.followed;
                // cookies.set('user', JSON.stringify( lUser ) , {path:'/', })

                // cookies.set('follower', JSON.stringify( result.data.follower ) , {path:'/', })
                // cookies.set('followed', JSON.stringify( result.data.followed ) , {path:'/', })

                // dispatch( loginAction( result.data.loginUser ) )
                // dispatch( setFollower( result.data.follower ) )
                // dispatch( setFollowed( result.data.followed ) )

                handleJoin(result.data.memberId)

                localStorage.setItem("nickname", result.data.nickname);
                navigate('/main');
            }

            // if( result.data.msg == 'ok'){

            //     const res = await axios.get('/api/member/getLoginUser');
            //     const lUser = res.data.loginUser;

            //     lUser['follower'] = res.data.follower;
            //     lUser['followed'] = res.data.followed;
            //     cookies.set('user', JSON.stringify( lUser ) , {path:'/', })

            //     cookies.set('follower', JSON.stringify( res.data.follower ) , {path:'/', })
            //     cookies.set('followed', JSON.stringify( res.data.followed ) , {path:'/', })

            //     dispatch( loginAction( res.data.loginUser ) )
            //     dispatch( setFollower( res.data.follower ) )
            //     dispatch( setFollowed( res.data.followed ) )

            //     handleJoin(lUser.memberId)

            //     localStorage.setItem("nickname", lUser.nickname);
            //     navigate('/main');
            // }else{
            //   setPwd("");
            //   return alert(result.data.msg);
            // }
        }catch(err){ console.error(err)}
    }

    const [userCount, setUserCount] = useState();
    const [client, setClient] = useState(null);

    useEffect(() => {
        // WebSocket 클라이언트 설정
        const stompClient = new Client({
          brokerURL: `ws://${process.env.REACT_APP_ADDRESS2}/ws_real_chat`,  // 서버의 WebSocket 엔드포인트
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
          webSocketFactory: () => new SockJS(`${process.env.REACT_APP_ADDRESS2}/ws_real_chat`),
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

    const toggleForm = (isSignUpMode) => {
      setIsSignUp(isSignUpMode);
      setEmail('');
      setPwd('');
    };

    return (
        <div className="container">
            <div className="loginform-header">
                <RealtimeConnectInfo />
                <div className="toggle-btns">
                    <button
                        className={`toggle-btn ${!isSignUp ? 'active' : ''}`}
                        onClick={() => setIsSignUp(false)}
                    >
                        LOGIN
                    </button>
                    <button
                        className={`toggle-btn ${isSignUp ? 'active' : ''}`}
                        onClick={() => setIsSignUp(true)}
                    >
                        JOIN
                    </button>
                    <button id="kakao" onClick={()=>{
                        window.location.href='http://localhost:8070/member/kakaoStart';
                    }}>KAKAO LOGIN</button>
                </div>

                <div className="loginContent">
                    <div className="loginform">
                        {/* 조건부 렌더링 */}
                        {!isSignUp ? (
                            <div className="signin">
                                <div className="field" id="login-field">
                                    <label>E-MAIL</label>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="E-MAIL"
                                    />
                                </div>
                                <div className="field" id="login-field">
                                    <label>PASSWORD</label>
                                    <input
                                        type="password"
                                        value={pwd}
                                        onChange={(e) => setPwd(e.target.value)}
                                        placeholder="PASSWORD"
                                    />
                                </div>
                                <div className="login-btns">
                                    <div className="login-btn" onClick={onLoginLocal}>
                                        <IoLogIn />
                                        &nbsp;LOGIN
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="signup">
                                <JoinForm onCancel={() => setIsSignUp(false)} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
