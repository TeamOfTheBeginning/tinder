import React, {useState, useEffect} from 'react';
import Loading from './Loading';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginAction, setFollower, setFollowed } from '../store/userSlice';
import { Cookies } from 'react-cookie';
import { setCookie, getCookie } from '../util/cookieUtil';
import { setCookie1, getCookie1 } from '../util/cookieUtil2';

import '../style/login.css';
import { IoLogIn, IoCreateOutline } from 'react-icons/io5';
import RealtimeConnectInfo from './realtimeconnectinfo/RealtimeConnectInfo';
import JoinForm from './member/JoinForm';
import { SiOutline } from 'react-icons/si';

import jaxios from '../util/jwtUtil'

//웹소켓 경로 관련
const isLocalhost = window.location.hostname === 'localhost' ;
// || window.location.hostname === '127.0.0.1';

const API_BASE_URL = isLocalhost
  ? 'http://localhost:8070' // 로컬 개발 환경
  : `http://${window.location.hostname}:8070`; // 클라이언트가 실행 중인 네트워크 기반으로 서버 IP 설정

const SOCKET_URL = `${API_BASE_URL}/ws_real_chat`;

const Login = () => {
    const [isLoginSuccess, setIsLoginSuccess] = useState(false);
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
    const [progress, setProgress] = useState(0);

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate('');
    const dispatch = useDispatch('');
    const cookies = new Cookies('');

    const handleLoginSuccess = () => {
        setIsLoginSuccess(true); // 로그인 성공 상태 활성화
        setTimeout(() => setLoadingComplete(true), 6500); // 로딩 완료 후 상태 변경
        setTimeout(() => navigate('/main'), 6500); // 메인 페이지로 이동
    };

    async function onLoginLocal(){
        if( !email ){ return alert('이메일을 입력하세요')}
        if( !pwd ){ return alert('비밀번호를 입력하세요')}
        try{
            const result = await axios.post('/api/member/loginlocal', null ,{ params:{username:email, password:pwd} })
            // console.log('1')
            // console.log(result)

            if( result.data.error === 'ERROR_LOGIN'){
                setPwd('');
                return alert('이메일과 패스워드를 확인하세요')
            }else{              
                // console.log(result.data)
                // console.log('result.data'+JSON.stringify( result.data ))

                // cookies.set('user', JSON.stringify( result.data ) , {path:'/', })

                // setCookie( 'user', JSON.stringify(result.data) , 1)

                // setCookie1('user', JSON.stringify(result.data) , 1)

                // setCookie( 'accessToken', JSON.stringify(result.data.accessToken) , 1)

                // setCookie( 'refreshToken', JSON.stringify(result.data.refreshToken) , 1)

                // const loginUserStr = JSON.stringify(result.data);
                // // 문자열 길이 계산
                // const sizeInBytes = new TextEncoder().encode(loginUserStr).length;

                // console.log(sizeInBytes); // 바이트 단위로 크기 출력
                // console.log(sizeInBytes / 1024 / 1024); // MB 단위로 크기 출력
                
                setCookie1('user', JSON.stringify(result.data) , 1)
                dispatch( loginAction( result.data ) )
                
                // navigate('/main');

                let accessToken=result.data.accessToken
                let refreshToken=result.data.refreshToken

                const res = await jaxios.get('/api/member/getLoginUser',{params:{memberId:result.data.memberId}});

                // console.log('JSON.stringify(res.data.loginUser)'+JSON.stringify(res.data.loginUser))

                res.data.loginUser.accessToken=accessToken;
                res.data.loginUser.refreshToken=refreshToken;

                setCookie1('user', JSON.stringify(res.data.loginUser) , 1)
                dispatch( loginAction( res.data.loginUser ) )

                // console.log(res.data.loginUser)
                // console.log(JSON.stringify(res.data.loginUser))

                const lUser = res.data.loginUser;

                lUser['follower'] = res.data.follower;
                lUser['followed'] = res.data.followed;
                // cookies.set('user', JSON.stringify( lUser ) , {path:'/', })
                // dispatch( loginAction( res.data.loginUser ) )
                dispatch( setFollower( res.data.follower ) )
                dispatch( setFollowed( res.data.followed ) )

                // setCookie1('user', JSON.stringify(res.data.loginUser) , 1)
                cookies.set('follower', JSON.stringify( res.data.follower ) , {path:'/', })
                cookies.set('followed', JSON.stringify( res.data.followed ) , {path:'/', })            
                
                // console.log('result.data.memberId'+result.data.memberId)
                // console.log('result.data.nickname'+result.data.nickname)

                handleJoin(result.data.memberId);
                localStorage.setItem('nickname', result.data.nickname);
                
                // 로그인 성공 상태 활성화
                setIsLoginSuccess(true);

                // // 2초 후에 /main으로 이동
                // setTimeout(() => {
                //     navigate('/main');
                // }, 2000);

                // // 충전 애니메이션 시작
                // let percent = 0;
                // const interval = setInterval(() => {
                //     percent += 10;
                //     setProgress(percent);
                //     if (percent >= 100) {
                //         clearInterval(interval);
                //         setTimeout(() => {
                //             navigate('/main');
                //         }, 1000); // 충전 완료 후 0.5초 후 이동
                //     }
                // }, 200);
            }

        }catch(err){ console.error(err)}
    }

    const [userCount, setUserCount] = useState();
    const [client, setClient] = useState(null);
    

    useEffect(() => {
        // WebSocket 클라이언트 설정
        const stompClient = new Client({
          brokerURL: `ws://${API_BASE_URL}/ws_real_chat`,  // 서버의 WebSocket 엔드포인트
          connectHeaders: {
            // 필요한 경우 인증 정보 추가
          },
          onConnect: () => {
            // console.log('WebSocket connected');
        
            // 서버에 접속자 수를 요청하는 메시지 발송
            stompClient.publish({
            destination: '/app/getUserCount',
            });

            // 서버로부터 접속자 수 업데이트를 실시간으로 받기 위해 구독
            stompClient.subscribe('/topic/real_chat/userCount', (message) => {
            // console.log('Received message:', message.body);
            // alert(message.body);

            const parsedMessage = JSON.parse(message.body);

            // console.log('parsedMessage'+parsedMessage)
            
            // console.log('parsedMessage.userCount'+parsedMessage.userCount)

            const userCount = Number(parsedMessage.userCount);

            setUserCount(userCount);

            // setUserCount(parseInt(message.body.userCount));  // 서버에서 받은 접속자 수 업데이트
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

 // 사용자가 접속하거나 퇴장하는 메서드
  const handleJoin = (memberId) => {
    client.publish({ destination: '/app/join', body: JSON.stringify({ memberId }) });
  };

    const toggleForm = (isSignUpMode) => {
      setIsSignUp(isSignUpMode);
      setEmail('');
      setPwd('');
    };


    const handleLoadingComplete = () => {
        navigate('/main'); // 메인 페이지로 이동
        setLoadingComplete(true);
    };

    return (
        <div className='container'>
            {isLoginSuccess ? (
                !loadingComplete ? (
                    <Loading onComplete={handleLoadingComplete} />
                ) : null
            ) : (
                <div className='loginform-header'>
                    <RealtimeConnectInfo />
                    <div className='toggle-btns'>
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
                        <button id='kakao' onClick={() => {
                            window.location.href = 'http://localhost:8070/member/kakaoStart';
                        }}>KAKAO LOGIN</button>
                    </div>
    
                    <div className='loginContent'>
                        <div className='loginform'>
                            <form onSubmit={onLoginLocal}>
                                {!isSignUp ? (
                                    <div className='signin'>
                                        <div className='field'>
                                            <label className='hidden'>E-MAIL</label>
                                            <input
                                                type='text'
                                                name='email'
                                                autoComplete='email'
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder='E-MAIL'
                                            />
                                        </div>
                                        <div className='field'>
                                            <label className='hidden'>PASSWORD</label>
                                            <input
                                                type='password'
                                                value={pwd}
                                                name='password'
                                                autoComplete='current-password'
                                                onChange={(e) => setPwd(e.target.value)}
                                                placeholder='PASSWORD'
                                            />
                                        </div>
                                        <div className='login-btns'>
                                            <button type='submit' className='login-btn'>
                                                <IoLogIn />
                                                &nbsp;LOGIN
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='signup'>
                                        <JoinForm onCancel={() => setIsSignUp(false)} />
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    
    
};

export default Login;
