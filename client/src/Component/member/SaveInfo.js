import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { loginAction, setFollowers, setFollowings } from '../../store/userSlice';

const SaveInfo = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(
        ()=>{
            axios.get('/api/member/getLoginUser')
            .then((res)=>{
                dispatch( loginAction( res.data.loginUser ) )
                dispatch( setFollowers( res.data.followers ) )
                dispatch( setFollowings( res.data.followings ) )
                navigate('/main')
            })
        },[]
    )
    return (
        <div>
        
        </div>
    )
}

export default SaveInfo
