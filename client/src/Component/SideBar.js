import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import { CgProfile } from "react-icons/cg";
import { IoHomeSharp, IoSparkles, IoSearch, IoLogOut } from "react-icons/io5";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { TbMailHeart } from "react-icons/tb";
import { IoClose } from "react-icons/io5";

import WritePost from "./post/WritePost";
import Match from "./match/Match";
import FindChatGroup from "./chat/FindChatGroup";
import MyPage from "./member/MyPage";
import Search from "./search/Search";

import '../style/sidebar.css';

const SideBar = () => {
  const loginUser = useSelector(state => state.user);
  const [profileImg, setProfileImg] = useState('');
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState(null);
  const sideViewerRef = useRef(null); // SideViewer 영역을 참조

  useEffect(() => {
    if (loginUser.profileImg) {
      setProfileImg(`http://localhost:8070/userimg/${loginUser.profileImg}`);
    }
  }, [loginUser]);

  // 메뉴 클릭 시 SideViewer 제어
  const handleMenuClick = (menu) => {
    if (selectedMenu === menu) {
      setSelectedMenu(null); // 같은 메뉴 클릭 시 닫기
    } else {
      setSelectedMenu(null); // 기존 메뉴 닫기
      setTimeout(() => setSelectedMenu(menu), 200); // 애니메이션 후 변경
    }
  };

  // SideViewer 닫기
  const closeSideViewer = () => {
    setSelectedMenu(null);
  };

  // SideViewer 외부 클릭 시 닫기
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (sideViewerRef.current && !sideViewerRef.current.contains(e.target)) {
        setSelectedMenu(null); // 외부 클릭 시 닫기
      }
    };

    // document에 클릭 이벤트 리스너 추가
    document.addEventListener('click', handleOutsideClick);

    // clean up
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className='MenuBar'>
      <div className='MenubarBtns'>
        <div className='profileImg' id='btn' onClick={() => handleMenuClick('mypage')}>
          <img src={profileImg} alt="Profile" />
        </div>

        <div className='btn' onClick={() => navigate('/main')}>
          <IoHomeSharp />
        </div>

        <div className='btn' onClick={() => handleMenuClick('writePost')}>
          <MdOutlineAddPhotoAlternate />
        </div>

        <div className='btn' onClick={() => handleMenuClick('match')}>
          <IoSparkles />
        </div>

        <div className='btn' onClick={() => handleMenuClick('findChatGroup')}>
          <TbMailHeart />
        </div>

        <div className='btn' onClick={() => handleMenuClick('mypage')}>
          <CgProfile />
        </div>

        <div className='btn' onClick={() => handleMenuClick('search')}>
          <IoSearch />
        </div>

        <div className='btn' onClick={() => navigate('/')}>
          <IoLogOut />
        </div>
      </div>

      {/* SideViewer */}
      <div className={`SideViewer ${selectedMenu ? 'show' : ''}`} ref={sideViewerRef}>
        <div className='sideViewerHeader'>
          <button className='closeBtn' onClick={closeSideViewer}>
            <IoClose />
          </button>
        </div>

        <div className='sideViewerContent'>
          {selectedMenu === 'writePost' && <WritePost />}
          {selectedMenu === 'match' && <Match />}
          {selectedMenu === 'findChatGroup' && <FindChatGroup />}
          {selectedMenu === 'mypage' && <MyPage />}
          {selectedMenu === 'search' && <Search />}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
