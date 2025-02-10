import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useSelector } from 'react-redux';

import MainMenu from './MainMenu'
import Post from './post/Post';
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
        <div style={{display:"flex", flexDirection:"column", alignItems:"center"}} >
            <MainMenu setWord={setWord} />
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
    )
}

export default Main
