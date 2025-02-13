import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';

import SideBar from './SideBar';
import Post from './post/Post';
import Notification from './notification/Notification'
import ToastPopupPost from './post/ToastPopupPost';

import '../style/mystargram.css';
import '../style/posts.css';

const Main = () => {

    const [postList, setPostList ] = useState([]);
    const [postOne, setPostOne ] = useState();
    const navigate = useNavigate();
    const [followed, setFollowed]=useState([]);
    const [paging, setPaging] = useState({})
    const [word, setWord] = useState('n')
    const loginUser = useSelector(state=>state.user);
    const [notificationList,setNotificationList] = useState();

    useEffect(
        ()=>{
            // setFollower( [...loginUser.follower] )

            axios.get(`/api/post/getPostList`, {params:{word,page:1}})
            .then((result)=>{
                // console.log("result"+JSON.stringify(result));
                setPostList( result.data.postList2 );
            }).catch((err)=>{console.error(err)})

            axios.get(`/api/post/getPostOneWithin3daysOrderByRand`, {params:{word,page:1}})
            .then((result)=>{  
                // console.log( JSON.stringify(result.data.postOne) )          
                setPostOne( result.data.postOne );
                
            }).catch((err)=>{console.error(err)})

            axios.get(`/api/notification/getNotificationTop4`, { params: { memberId:loginUser.memberId } })
            .then((result)=>{
            console.log("getNotificationTop4"+result.data.notificationList)
            setNotificationList(result.data.notificationList)
            }
            ).catch((err)=>{console.error(err)}) 


            


        }, [word]
    )


    const [showToast, setShowToast] = useState(false);
    const [remainingTime, setRemainingTime] = useState(5000); // 초기 5초
    const [timerId, setTimerId] = useState(null);

    useEffect(() => {
        if (postOne) {
            setShowToast(true);
            startTimer(5000); // 처음 5초 설정
        }
    }, [postOne]);

    const startTimer = (time) => {
        if (timerId) clearTimeout(timerId); // 기존 타이머 제거
        const id = setTimeout(() => setShowToast(false), time);
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









    return (
        <div className='Container'>

            <Notification setNotificationList={setNotificationList} notificationList={notificationList}/>
            
            {showToast && (
                <div
                    className="toast-popup"
                    onMouseEnter={pauseTimer}  // 마우스 오버 시 타이머 중단
                    onMouseLeave={resumeTimer} // 마우스 떠날 때 남은 시간부터 다시 시작
                >
                    <ToastPopupPost postOne={postOne} />
                </div>
            )}

            <div className='left'>
                <SideBar />
            </div>
            
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

        </div>
    )
}

export default Main
