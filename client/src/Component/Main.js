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
            // setFollower( [...loginUser.follower] )

            axios.get(`/api/post/getPostList`, {params:{word,page:1}})
            .then((result)=>{
                // console.log("result"+JSON.stringify(result));
                setPostList( result.data.postList2 );
            }).catch((err)=>{console.error(err)})

            axios.get(`/api/post/getPostOneWithin3daysOrderByRand`)
            .then((result)=>{  
                // console.log( JSON.stringify(result.data.postOne) )          
                setPostOne( result.data.postOne );
                
            }).catch((err)=>{console.error(err)})

            axios.get(`/api/member2/getOppositeGender2`, { params: { memberId:loginUser.memberId } })
            .then((result) => {
                console.log("result.data.oppositeGender: " + JSON.stringify(result.data.oppositeGender));
                setOppositeGender(result.data.oppositeGender);
            })
            .catch((err) => { console.error(err); });

            axios.get(`/api/notification/getNotificationTop4`, { params: { memberId:loginUser.memberId } })
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
        setShowToast0(true);
        startTimer(5000); // 처음 5초 설정
    
        if (postOne) {
            setTimeout(() => {
                setShowToast1(true);
                startTimer(7000); // 7초 후에 표시
            }, 5000); // showToast0이 뜬 후에 5초 뒤에 showToast1 표시
        }
    
        setTimeout(() => {
            setShowToast2(true);
        }, 12000); // showToast1이 사라진 후에 12초 뒤에 showToast2 표시
    
    }, [postOne]);
    

    const startTimer = (time) => {
        if (timerId) clearTimeout(timerId); // 기존 타이머 제거
        const id = setTimeout(() => setShowToast1(false), time);
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

            {showToast0 && (
                <div
                    className="toastPopup0"                    
                    // onAnimationEnd={handleAnimationEnd} // 애니메이션 종료 후 처리
                    // style={{ pointerEvents: isAnimationEnded ? 'none' : 'auto' }} 
                >
                    <div className='toastPopup0Title'>웰컴존</div>
                    
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
