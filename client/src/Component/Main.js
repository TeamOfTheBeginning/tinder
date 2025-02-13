import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';

import SideBar from './SideBar';
import Post from './post/Post';
import Notification from './notification/Notification'

import '../style/mystargram.css';
import '../style/posts.css';

const Main = () => {

    const [postList, setPostList ] = useState([]);
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

            axios.get(`/api/notification/getNotificationTop4`, { params: { memberId:loginUser.memberId } })
            .then((result)=>{
            console.log("getNotificationTop4"+result.data.notificationList)
            setNotificationList(result.data.notificationList)
            }
            ).catch((err)=>{console.error(err)}) 



        }, [word]
    )









    return (
        <div className='Container'>

            <Notification setNotificationList={setNotificationList} notificationList={notificationList}/>

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
