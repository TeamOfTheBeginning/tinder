import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { loginAction, setFollowers, setFollowings } from '../../store/userSlice';
import {Cookies} from 'react-cookie'

import jaxios from '../../util/jwtUtil';

const Savekakaoinfo = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const cookies = new Cookies()

    useEffect(
        ()=>{
            jaxios.get('/api/member/getLoginUser')
            .then((result)=>{
                cookies.set('user', JSON.stringify( result.data.loginUser ) , {path:'/', })
                dispatch( loginAction(result.data.loginUser) );
                navigate('/main');
            })
        }, []
    )
    return (
        <div>
        
        </div>
    )
}

export default Savekakaoinfo
