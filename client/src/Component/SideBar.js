import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
// import axios from 'axios';

import RealtimeConnectInfo from './realtimeconnectinfo/RealtimeConnectInfo';

// 아이콘 import
import { IoHomeSharp, IoSparkles, IoSearch, IoLogOut } from 'react-icons/io5';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { TbMailHeart } from 'react-icons/tb';
import { IoClose } from 'react-icons/io5';
import { FaRandom } from 'react-icons/fa';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { AiOutlineFullscreen } from "react-icons/ai";
import { AiOutlineFullscreenExit } from "react-icons/ai";
// page import
import WritePost from './post/WritePost';
import Match from './match/Match';
import FindLiker from './match/FindLiker';
import MatchedMember from './match/MatchedMember';
import FindChatGroupRandom from './chat/FindChatGroupRandom';
import FindChatGroup from './chat/FindChatGroup';
import ChatRoomFromMatch from './chat/ChatRoomFromMatch';
import ChatRoomFromChatGroup from './chat/ChatRoomFromChatGroup';
import ChatRoomFromRandom from './chat/ChatRoomFromRandom';
import RealTimeChat from './realtimechat/RealTimeChat';
import MyPage from './member/MyPage';
import Search from './search/Search';
import EditProfile from './member/EditProfile';
import EditOpponent from './member/EditOpponent';
import NearMember from './member/NearMember';
// style
import '../style/sidebar.css';

import jaxios from '../util/jwtUtil';
import { setCookie1 , getCookie1 , removeCookie1} from '../util/cookieUtil2';

//웹소켓 경로 관련
const isLocalhost = window.location.hostname === 'localhost' ;
// || window.location.hostname === '127.0.0.1';

const API_BASE_URL = isLocalhost
  ? 'http://localhost:8070' // 로컬 개발 환경
  : `http://${window.location.hostname}:8470`; // 클라이언트가 실행 중인 네트워크 기반으로 서버 IP 설정

const SOCKET_URL = `${API_BASE_URL}/ws_real_chat`;

const SideBar = (props) => {
  const loginUser = useSelector(state => state.user);
  const [profileImg, setProfileImg] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [subMenu, setSubMenu] = useState(null); // 서브 메뉴 상태 관리
  const sideViewerRef = useRef(null);
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState();
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (loginUser.profileImg) {
      setProfileImg(`${process.env.REACT_APP_ADDRESS2}/userimg/${loginUser.profileImg}`);
    }
  }, [loginUser]);

  // 메뉴 클릭 시 SideViewer 열기
  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setSubMenu(null); // 서브 메뉴 초기화
  };

  const [subMenuData, setSubMenuData] = useState(null);

  // 서브 메뉴 클릭 핸들러
  const handleSubMenuClick = (menu, chatGroupId) => {
    setSubMenu(menu);  // 서브메뉴 이름 변경
    console.log('chatGroupId'+chatGroupId)
    setSubMenuData(chatGroupId);  // chatGroupId 값 설정

  };

const selectedMenuRef = useRef(selectedMenu);
const subMenuRef = useRef(subMenu);

useEffect(() => {
  selectedMenuRef.current = selectedMenu;
  subMenuRef.current = subMenu;
}, [selectedMenu, subMenu]);

const subMenuDataRef = useRef(null);

const closeSideViewer = () => {
  if (selectedMenuRef.current === 'findChatGroupRandom' && subMenuRef.current === 'chatRoomFromRandom') {

    const chatGroupId = subMenuDataRef.current;
    console.log("chatGroupId"+chatGroupId)
    if (chatGroupId !== null) {  // subMenuData가 null이 아닌지 확인
      props.setSbMsg("외부 클릭이 감지되었습니다.");
      props.setOpen(true);

      console.log('in chatGroupId' + chatGroupId);

      jaxios.post(`/api/chat/setChatRoomDeactivated`, null, {
        params: { chatGroupId: chatGroupId }
      })
      .then((res) => {
          if (res.data.result === 'yes') {
            props.setSbMsg("대화방이 종료됩니다");
            props.setOpen(true);
          } else {
              alert('오류발생.');
          }
      })
      .catch((err) => console.error(err));
    }
  }

  setSelectedMenu(null);
  setSubMenu(null);
};

  
  
  // 바깥 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideViewerRef.current && !sideViewerRef.current.contains(event.target)) {
        closeSideViewer(); // SideViewer 외부 클릭 시 닫기
      }
    };

    document.addEventListener('mousedown', handleClickOutside); // 전역 클릭 이벤트 추가
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // 컴포넌트 언마운트 시 이벤트 제거
    };
  }, []);

    useEffect(() => {
      // WebSocket 클라이언트 설정
      const stompClient = new Client({
        brokerURL: `ws://${API_BASE_URL}/ws_real_chat`,  // 서버의 WebSocket 엔드포인트
        connectHeaders: {
          // 필요한 경우 인증 정보 추가
        },
        // debug: function (str) {
        //   console.log(str);
        // },
        onConnect: () => {
          // console.log('WebSocket connected');
        
          // 서버에 접속자 수를 요청하는 메시지 발송
          stompClient.publish({
            destination: '/app/getUserCount',
          });

          // 서버로부터 접속자 수 업데이트를 실시간으로 받기 위해 구독
          stompClient.subscribe('/topic/real_chat/userCount', (message) => {
            // console.log('Received message:', message.body);

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
  
    // // 사용자가 접속하거나 퇴장하는 메서드
    // const handleJoin = (username) => {
    //   client.publish({ destination: '/app/join', body: JSON.stringify({ username }) });
    // };
  
    const handleLeave = (memberId) => {
      client.publish({ destination: '/app/leave', body: JSON.stringify({ memberId }) });
    };

    useEffect(() => {
      // 창을 닫을 때 handleLeave 호출
      const handleBeforeUnload = () => {
        if (loginUser.email && client) {
          client.publish({
            destination: '/app/leave',
            body: JSON.stringify({ memberId:loginUser.memberId }),
          });
        }
      };
  
      // 페이지를 떠나기 전에 호출되는 이벤트 리스너 추가
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      // 컴포넌트 언마운트 시, 이벤트 리스너 제거
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, [loginUser.email, client]);

  return (
    <div className='MenuBar'>
      <RealtimeConnectInfo />
      <div className='MenubarBtns'>
        <div data-ignore-click='true' className={`profileImg ${selectedMenu === 'mypage' ? 'active' : ''}`} 
        onClick={() => handleMenuClick('mypage')}>
          <img src={profileImg} alt='Profile' />
        </div>

        {(!props.isFullScreen)?(
          <div 
          className={`sidebar-btn`} 
          onClick={()=>{props.enterFullScreen()}}
        >
          <AiOutlineFullscreen className='fullScreenToggle' />
        </div>
        ):(
          <div 
          className={`sidebar-btn ${selectedMenu === 'search' ? 'active' : ''}`} 
          onClick={()=>{props.exitFullScreen()}}
        >
          <AiOutlineFullscreenExit className='fullScreenToggle' />
        </div>
        )}

        <div className='sidebar-btn' 
        onClick={() => window.location.reload()}
        >
          <IoHomeSharp />
        </div>

        <div 
          className={`sidebar-btn ${selectedMenu === 'writePost' ? 'active' : ''}`} 
          onClick={() => handleMenuClick('writePost')}
        >
          <MdOutlineAddPhotoAlternate />
        </div>

        <div 
          className={`sidebar-btn ${selectedMenu === 'match' ? 'active' : ''}`} 
          onClick={() => handleMenuClick('match')}
        >
          <IoSparkles />
        </div>

        <div 
          className={`sidebar-btn ${selectedMenu === 'nearMember' ? 'active' : ''}`} 
          onClick={() => handleMenuClick('nearMember')}
        >
          <FaMapMarkerAlt />
        </div>

        <div 
          className={`sidebar-btn ${selectedMenu === 'findChatGroupRandom' ? 'active' : ''}`} 
          onClick={() => handleMenuClick('findChatGroupRandom')}
        >
          <FaRandom />
        </div>

        <div 
          className={`sidebar-btn ${selectedMenu === 'findChatGroup' ? 'active' : ''}`} 
          onClick={() => handleMenuClick('findChatGroup')}
        >
          <TbMailHeart />
        </div>

        <div 
          className={`sidebar-btn ${selectedMenu === 'realtimechat' ? 'active' : ''}`} 
          onClick={() => handleMenuClick('realtimechat')}
        >
          <HiOutlineChatAlt2 />
        </div>

        <div 
          className={`sidebar-btn ${selectedMenu === 'search' ? 'active' : ''}`} 
          onClick={() => handleMenuClick('search')}
        >
          <IoSearch />
        </div>

        
        
        

        <div 
          className='sidebar-btn logout-btn' 
          onClick={() => {  
          handleLeave(loginUser.memberId); 
          removeCookie1('user', '/'); 
          sessionStorage.removeItem("user");
          navigate('/');
          }}
        >
          <IoLogOut />
        </div>
      </div>

      {/* SideViewer */}
      <div data-ignore-click="true" className={`SideViewer ${selectedMenu ? 'show' : ''}`} ref={sideViewerRef}>
        <div className='sideViewerHeader'>
          <button className='closeBtn'
          data-ignore-click="true" 
          onClick={closeSideViewer}>
            <IoClose 
            data-ignore-click="true" 
            />
          </button>
        </div>

        <div className='sideViewerContent'>
          {selectedMenu === 'writePost' && <WritePost closeSideViewer={closeSideViewer} />}
          {selectedMenu === 'match' && (
              subMenu === 'chatRoomFromMatch'
              ? <ChatRoomFromMatch chatGroupId={subMenuData} />
              :subMenu === 'findLiker'
              ? <FindLiker />
              : subMenu === 'matchedMember'
              ? <MatchedMember openSubMenu={handleSubMenuClick}  />
              : <Match onSubMenuSelect={handleSubMenuClick} />
          )}
          {selectedMenu === 'nearMember' && <NearMember loginUser={loginUser}/>}
          {selectedMenu === 'findChatGroupRandom' && (
            subMenu === 'chatRoomFromRandom' ? 
              <ChatRoomFromRandom chatGroupId={subMenuData} closeSideViewer={closeSideViewer} 
              setOpen={props.setOpen} setSbMsg={props.setSbMsg}
              />  // subMenuData는 'chatGroupId'로 설정한 값입니다.
            : <FindChatGroupRandom openSubMenu={handleSubMenuClick} setSubMenuData={setSubMenuData} subMenuDataRef={subMenuDataRef}/>
          )}

          {selectedMenu === 'findChatGroup' && (
            subMenu === 'chatRoomFromChatGroup' ? 
              <ChatRoomFromChatGroup chatGroupId={subMenuData} />  // subMenuData는 'chatGroupId'로 설정한 값입니다.
            : <FindChatGroup openSubMenu={handleSubMenuClick} />
          )}          
          
          {selectedMenu === 'realtimechat' && <RealTimeChat />}
          {selectedMenu === 'mypage' && (
            subMenu === 'editProfile' ? <EditProfile />
            : subMenu === 'editOpponent' ? <EditOpponent />
            : <MyPage openSubMenu={handleSubMenuClick} handleLeave={handleLeave}/>
          )}
          {selectedMenu === 'search' && <Search {...props}/>}
        </div>
      </div>
    </div>
  );
};

export default SideBar;