import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FiX } from "react-icons/fi";
import { FcCustomerSupport } from "react-icons/fc";

import SideBar from './SideBar';
import Post from './post/Post';
import Notification from './notification/Notification'
import ToastPopupPost from './post/ToastPopupPost';
import MatchingMember from './match/MatchingMember';
import ChatBot from './chatbot/ChatBot';

import { XyzTransition } from '@animxyz/react';
import '@animxyz/core';
import jaxios from '../util/jwtUtil'

import '../style/mystargram.css';
import '../style/posts.css';
import '../style/chatbot/chatbot.css';

const Main = () => {

    const [postList, setPostList ] = useState([]);
    const [postOne, setPostOne ] = useState();
    const navigate = useNavigate();
    const [followed, setFollowed]=useState([]);
    const [paging, setPaging] = useState({})
    const [word, setWord] = useState('n')
    const loginUser = useSelector(state=>state.user);
    const [notificationList,setNotificationList] = useState();
    const [oppositeGender, setOppositeGender] = useState();
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);

    const toggleChatbot = () => {
        if (!isChatbotOpen) {
            setChatMessages([
                { role: "assistant", content: "안녕하세요! 무엇을 도와드릴까요?" }
            ]);
        }
        setIsChatbotOpen(!isChatbotOpen);
    };      

    useEffect(
        ()=>{
            console.log("loginUser"+JSON.stringify(loginUser))
            // setFollower( [...loginUser.follower] )

            jaxios.get(`/api/post/getPostList`, {params:{word,page:1}})
            .then((result)=>{
                console.log("result"+JSON.stringify(result.data.postList2));
                setPostList( result.data.postList2 );
            }).catch((err)=>{console.error(err)})

            jaxios.get(`/api/post/getPostOneWithin3daysOrderByRand`)
            .then((result)=>{  
                // console.log( JSON.stringify(result.data.postOne) )          
                setPostOne( result.data.postOne );
                
            }).catch((err)=>{console.error(err)})

            jaxios.get(`/api/member2/getOppositeGender2`, { params: { memberId:loginUser.memberId } })
            .then((result) => {
                console.log("result.data.oppositeGender: " + JSON.stringify(result.data.oppositeGender));
                setOppositeGender(result.data.oppositeGender);
            })
            .catch((err) => { console.error(err); });

            jaxios.get(`/api/notification/getNotificationTop4`, { params: { memberId:loginUser.memberId } })
            .then((result)=>{
            // console.log("getNotificationTop4"+result.data.notificationList)
            setNotificationList(result.data.notificationList)
            }
            ).catch((err)=>{console.error(err)}) 


            


        }, [word]
    )

    const [showToast0, setShowToast0] = useState(false);
    const [showToast1, setShowToast1] = useState(false);
    const [showToast2, setShowToast2] = useState(false);
    const [remainingTime, setRemainingTime] = useState(5000); // 초기 5초
    const [timerId, setTimerId] = useState(null);

    useEffect(() => {
        const timers = [];

        // showToast0 표시
        setShowToast0(true);
        const timer0 = setTimeout(() => {
            setShowToast0(false); // 5초 뒤 showToast0 종료
        }, 5000);
        timers.push(timer0);
    
        // showToast0이 끝난 후 showToast1을 표시
        if (postOne) {
            const timer1 = setTimeout(() => {
                setShowToast1(true); // showToast1 표시
                const timer1End = setTimeout(() => {
                    setShowToast1(false); // 7초 뒤 showToast1 종료
                }, 7000);
                timers.push(timer1End);
            }, 5000); // showToast0 종료 후 5초 뒤에 showToast1 표시
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
    }, [postOne])

    

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

            <Notification setNotificationList={setNotificationList} notificationList={notificationList}/>

            {/* 웰컴존 토스트 팝업 */}
            {showToast0 && (
                <div
                    className={`toastPopup0 ${showToast0}`}
                    onAnimationEnd={() => setShowToast0(false)}
                >
                    <div className="toastPopup0Header">
                        <div>
                        <h1>{loginUser.nickname}님<br />
                            🎉 환영합니다! 🎉</h1>
                        </div>
                        <div className="heart"></div>
                    </div>
                    <div className="toastPopup0Content">
                        오늘도 좋은 하루 보내세요! 😊
                    </div>
                    <button
                        className="toastPopup0Close"
                        onClick={() => setShowToast0(false)}
                    >
                        ✖
                    </button>
                </div>
            )}

            
            {showToast1 && (
                <div
                    className="toastPopup1"
                    onMouseEnter={pauseTimer}  // 마우스 오버 시 타이머 중단
                    onMouseLeave={resumeTimer} // 마우스 떠날 때 남은 시간부터 다시 시작
                    onAnimationEnd={handleAnimationEnd} // 애니메이션 종료 후 처리
                    style={{ pointerEvents: isAnimationEnded ? 'none' : 'auto' }} 
                >
                    <div className='toastPopup1Title'>오늘의 추천 맴버</div>
                    <MatchingMember oppositeGender={oppositeGender}/>
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
                    <Post post={postOne}  followed={followed}  setFollowed={setFollowed} />
                    
                </div>
            )}

            

            <SideBar />
            
            {/* post */}
            <div className='PostList'>
                    {
                        (postList)?(
                            postList.map((post, idx)=>{
                                return (
                                    <Post key={idx} post={post}  followed={followed}  setFollowed={setFollowed} />
                                )
                            })
                        ):(null)
                    }
            </div>

            <div className="customer-service-icon" onClick={toggleChatbot}>
                {isChatbotOpen ? <FiX size={24} /> : <FcCustomerSupport size={24} />}
            </div>

            {isChatbotOpen && (
                <div className="chatbot-popup">
                    <ChatBot chatMessages={chatMessages} />
                </div>
            )}
        </div>
    )
}

export default Main
