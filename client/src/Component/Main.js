import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';

import MainMenu from './MainMenu';
import Post from './post/Post';
import '../style/mystargram.css';
import '../style/Posts.css';

const Main = () => {

    const [postList, setPostList ] = useState([]);
    const navigate = useNavigate();
    const [followings, setFollowings]=useState([]);
    const [paging, setPaging] = useState({})
    const [word, setWord] = useState('n')
    const loginUser = useSelector(state=>state.user);

    // useEffect(
    //     ()=>{
    //         setFollowings( [...loginUser.followings] )

    //         axios.get(`/api/post/getPostList`, {params:{word}})
    //         .then((result)=>{
    //             setPostList( result.data.postList );
    //         }).catch((err)=>{console.error(err)})

    //     }, [word]
    // )
    return (
        <div className='Container'>

            <div className='left'>
                <div className='MainMenu'><MainMenu setWord={setWord} /></div>
                <div className='Posts'>
                    {
                        (postList)?(
                            postList.map((post, idx)=>{
                                return (
                                    <Post key={idx} post={post}  followings={followings}  setFollowings={setFollowings} />
                                )
                            })
                        ):(null)
                    }
                </div>
            </div>

            {/* 멤버추천 */}
            <div className='right'>

            </div>
        </div>
    )
}

export default Main
