import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { FiX } from "react-icons/fi";
import { FcCustomerSupport } from "react-icons/fc";

import SideBar from './SideBar';
import Post from './post/Post';
import Statistics from './post/Statistics';
import AdComponent from './post/AdComponent';
import Notification from './notification/Notification';
import ToastPopupPost from './post/ToastPopupPost';
import MatchingMember from './match/MatchingMember';
import ChatBot from './chatbot/ChatBot';

import jaxios from '../util/jwtUtil';

import '../style/posts.css';
import '../style/chatbot/chatbot.css';
import { SiOutline } from 'react-icons/si';

const Main = () => {
    const [prevPost, setPrevPost] = useState(null); // 이전 포스트 저장
    const [postCount, setPostCount] = useState(0); // 전체 카운트
    const [postList, setPostList] = useState([]);
    const [showStatistics, setShowStatistics] = useState(false); // Statistics 표시 여부


    const [postOne, setPostOne] = useState();
    const navigate = useNavigate();
    const [followed, setFollowed] = useState([]);
    const [hashtag, setHashtag] = useState('');
    const loginUser = useSelector(state => state.user);
    const [notificationList, setNotificationList] = useState();
    const [oppositeGender, setOppositeGender] = useState();
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [pageable, setPageable] = useState();

    const props = {
        hashtag: hashtag,
        setHashtag: setHashtag,
    };

    const toggleChatbot = () => {
        if (!isChatbotOpen) {
            setChatMessages([{ role: "assistant", content: "안녕하세요! 무엇을 도와드릴까요?" }]);
        }
        setIsChatbotOpen(!isChatbotOpen);
    };

    useEffect(
        ()=>{
            window.addEventListener('scroll', handleScroll );
            return () => {
                window.removeEventListener("scroll", handleScroll);
            }
        }
    )

    const handleScroll=()=>{
    const scrollHeight = document.documentElement.scrollHeight - 20; // 스크롤이 가능한 크기
    // 가능 크기를 10px 줄여서 다음페이지 표시 반응 영역을 조금더 넓힙니다
    const scrollTop = document.documentElement.scrollTop;  // 현재 위치
    const clientHeight = document.documentElement.clientHeight; // 내용물의 크기
    if( scrollTop + clientHeight >= scrollHeight ) {
        // console.log("handleScroll"+pageable.pageNumber + 1)
        onPageMove( pageable.pageNumber + 1 );
    }
    }




    const videoRefs = useRef([]); // 비디오 요소를 저장할 배열


    // 📌 비디오 재생/정지 함수
    const handleVideoPlayPause = () => {
        videoRefs.current.forEach((video) => {
        if (!video) return;
        const rect = video.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

        if (isVisible) {
            video.play();
        } else {
            video.pause();
        }
        });
    };

    async function onPageMove( page ){
        // console.log("pageable.pageNumber"+pageable.pageNumber)
        jaxios.get(`/api/post/getPostList`, {params:{page:page,word:hashtag}})
        .then((result)=>{
        // console.log(result.data.postList2.pageable.pageNumber)
        setPageable( result.data.postList2.pageable );
        // console.log("result.data.postList2.pageable.pageNumber"+result.data.postList2.pageable.pageNumber)
        // let posts = [];
        // // posts = [...postList];
        // posts = [...result.data.postList2.content ];
        
        // setPostList(result.data.postList2.content);



        const newPost = result.data.postList2.content[0]; // 새로 가져온 1개의 포스트
        if (newPost) {
            setPrevPost(postList[0]); // 현재 포스트를 이전 포스트로 저장
            setPostList([newPost]); // 항상 1개 유지
            setPostCount(prev => prev + 1); // 전체 카운트 증가

            // 5번째일 때 Statistics만 먼저 보여주고 Post는 잠시 멈춤
            if ((postCount + 1) % 5 === 0) {
                setShowStatistics(true);
                setTimeout(() => {
                    setShowStatistics(false); // Statistics를 숨기고 Post를 보여줌
                }, 5000); // 3초 후 Post 등장
            }
        }


        }).catch((err)=>{console.error(err)})
    }

    useEffect(() => {
        // console.log("Updated hashtag:", hashtag);
        jaxios.get(`/api/post/getPostList`, { params: { word:hashtag, page: 0 } })
            .then((result) => {
                // console.log("result.data.postList2")
                // console.log(JSON.stringify(result.data.postList2.content))
                // console.log(JSON.stringify(result.data.postList2.pageable))
                setPostList(result.data.postList2.content);
                setPageable(result.data.postList2.pageable)
            }).catch((err) => { console.error(err) });
    }, [hashtag]);


    useEffect(() => {        
        jaxios.get(`/api/post/getPostOneWithin3daysOrderByRand`)
            .then((result) => {
                setPostOne(result.data.postOne);
            }).catch((err) => { console.error(err) });

        jaxios.get(`/api/member2/getOppositeGender2`, { params: { memberId: loginUser.memberId } })
            .then((result) => {
                setOppositeGender(result.data.oppositeGender);
            }).catch((err) => { console.error(err); });

        jaxios.get(`/api/notification/getNotificationTop4`, { params: { memberId: loginUser.memberId } })
            .then((result) => {
                setNotificationList(result.data.notificationList);
            }).catch((err) => { console.error(err) });
    }, []);

    // 📌 클릭 이벤트 → 페이지 이동 + 비디오 제어 추가
    useEffect(() => {
        const handleClick = (event) => {
        const windowHeight = window.innerHeight;
        const clickY = event.clientY;

        if (event.target.closest('[data-ignore-click="true"]')) {
            return; // 아이콘 클릭 시 페이지 이동 막기
        }

        if (clickY >= windowHeight - 100) {
            if (pageable?.pageNumber !== undefined) { // 🔥 undefined 방지
                // console.log("handleClick"+pageable.pageNumber + 1)
                onPageMove(pageable.pageNumber + 1);
            }
            // window.scrollBy({ top: windowHeight, behavior: "smooth" });
        } else if (clickY <= 100) {
            if (pageable?.pageNumber !== undefined) { // 🔥 undefined 방지
                // console.log("handleClick"+pageable.pageNumber - 1)
                onPageMove(pageable.pageNumber - 1);
            }
            // setPageable((prev) => ({ pageNumber: Math.max(prev.pageNumber - 1, 0) }));
            // window.scrollBy({ top: -windowHeight, behavior: "smooth" });
        }
        
        // 📌 페이지 변경 후 비디오 상태 업데이트
        setTimeout(handleVideoPlayPause, 500); // 스크롤 후 실행
        };

        document.addEventListener("click", handleClick);
        return () => {
        document.removeEventListener("click", handleClick);
        };
    }, [pageable]);

    // 📌 스크롤 이벤트 추가 → 스크롤 시에도 비디오 관리
    useEffect(() => {
        window.addEventListener("scroll", handleVideoPlayPause);
        return () => window.removeEventListener("scroll", handleVideoPlayPause);
    }, [pageable]);

    
    const [showToast1, setShowToast1] = useState(false);
    const [showToast2, setShowToast2] = useState(false);
    const [remainingTime, setRemainingTime] = useState(5000); // 초기 5초
    const [timerId, setTimerId] = useState(null);

    useEffect(() => {
        const timers = [];

        // showToast1 표시
        if (postOne) {
            setShowToast1(true); // showToast1 표시
            const timer1 = setTimeout(() => {
                setShowToast1(false); // 7초 뒤 showToast1 종료
            }, 7000);
            timers.push(timer1);
        }

        // showToast1이 끝난 후 12초 뒤에 showToast2 표시
        const timer2 = setTimeout(() => {
            setShowToast2(true); // showToast2 표시
            const timer2End = setTimeout(() => {
                setShowToast2(false); // 7초 뒤 showToast2 종료
            }, 7000);
            timers.push(timer2End);
        }, 12000); // showToast1 종료 후 12초 뒤에 showToast2 표시
        timers.push(timer2);

        return () => {
            // 모든 타이머 제거
            timers.forEach((timer) => clearTimeout(timer));
        };
    }, [postOne]);

    // 타이머 시작 함수
    const startTimer = (time, callback) => {
        if (timerId) clearTimeout(timerId); // 기존 타이머 제거
        const id = setTimeout(callback, time);
        setTimerId(id);
        setRemainingTime(time);
    };

    const pauseTimer = () => {
        if (timerId) {
            clearTimeout(timerId);
            setTimerId(null);
        }
    };

    const resumeTimer = () => {
        startTimer(remainingTime);
    };

    const [isAnimationEnded, setIsAnimationEnded] = useState(false);

    const handleAnimationEnd = () => {
        setIsAnimationEnded(true);
    };

    

    return (
        <div className='Container'>
            <Notification setNotificationList={setNotificationList} notificationList={notificationList} />

            {showToast1 && (
                <div
                    className="toastPopup1"
                    onMouseEnter={pauseTimer}  // 마우스 오버 시 타이머 중단
                    onMouseLeave={resumeTimer} // 마우스 떠날 때 남은 시간부터 다시 시작
                    onAnimationEnd={handleAnimationEnd} // 애니메이션 종료 후 처리
                    style={{ pointerEvents: isAnimationEnded ? 'none' : 'auto' }} 
                >
                    <div className='toastPopup1Title'>오늘의 추천 맴버</div>
                    <MatchingMember oppositeGender={oppositeGender} />
                </div>
            )}

            {showToast2 && (
                <div
                    className="toastPopup2"
                    onMouseEnter={pauseTimer}  // 마우스 오버 시 타이머 중단
                    onMouseLeave={resumeTimer} // 마우스 떠날 때 남은 시간부터 다시 시작
                    onAnimationEnd={handleAnimationEnd} // 애니메이션 종료 후 처리
                    style={{ pointerEvents: isAnimationEnded ? 'none' : 'auto' }} 
                >
                    <div className='toastPopup2Title'>오늘의 추천 포스트</div>
                    <Post post={postOne} followed={followed} setFollowed={setFollowed} />
                </div>
            )}

            <SideBar {...props}/>

            {/* post */}
            <div className="PostList">
                {showStatistics ? (
                    <Statistics />
                ) : (
                    postList.length > 0 && <Post post={postList[0]} followed={followed} setFollowed={setFollowed} />
                )}
            </div>



            {/* <div className='PostList'> */}
                {/* {
                    postList ? (
                        postList.map((post, idx) => {
                            

                            return (
                                <React.Fragment key={idx}>
                                    <Post post={post} followed={followed} setFollowed={setFollowed} videoRef={(el) => (videoRefs.current[idx] = el)}/>

                                    {(idx + 1) % 5 === 0 && <Statistics />}

                                    🔥 10번째마다 광고 삽입
                                    {(idx + 1) % 10 === 0 && <AdComponent />}
                                </React.Fragment>
                            );
                        })
                    ) : (null)
                } */}
            {/* </div> */}



            <div className="customer-service-icon" onClick={toggleChatbot}>
                {isChatbotOpen ? <FiX size={24} /> : <FcCustomerSupport size={24} />}
            </div>

            {isChatbotOpen && (
                <div className="chatbot-popup">
                    <ChatBot chatMessages={chatMessages} />
                </div>
            )}
        </div>
    );
}

export default Main;
