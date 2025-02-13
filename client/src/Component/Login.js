import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { loginAction, setFollower, setFollowed } from '../store/userSlice';
import {Cookies} from 'react-cookie'

import '../style/mystargram.css'
import '../style/login.css'
import { IoLogIn, IoCreateOutline } from "react-icons/io5";


const Login = () => {
    const [email, setEmail]=useState('')
    const [pwd, setPwd]=useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const cookies = new Cookies()

    async function onLoginLocal(){
        if( !email ){ return alert('이메일을 입력하세요')}
        if( !pwd ){ return alert('비밀번호를 입력하세요')}
        try{
            const result = await axios.post('/api/member/loginlocal', null ,{ params:{email, pwd} })
            // console.log("1")
            // console.log(result)
            
            if( result.data.msg == 'ok'){

                const res = await axios.get('/api/member/getLoginUser');
                const lUser = res.data.loginUser;
                
                lUser['follower'] = res.data.follower;
                lUser['followed'] = res.data.followed;
                cookies.set('user', JSON.stringify( lUser ) , {path:'/', })
                
                cookies.set('follower', JSON.stringify( res.data.follower ) , {path:'/', })
                cookies.set('followed', JSON.stringify( res.data.followed ) , {path:'/', })
                
                dispatch( loginAction( res.data.loginUser ) )
                dispatch( setFollower( res.data.follower ) )
                dispatch( setFollowed( res.data.followed ) )

                localStorage.setItem("nickname", lUser.nickname);
                navigate('/main');
            }else{
                setPwd("");
                return alert(result.data.msg);
            }
        }catch(err){ console.error(err)}
    }

    return (
        
        <div className='loginform'>
            <div className='field'>
                <label>EMAIL</label>
                <input type="text" value={email} onChange={(e)=>{ setEmail(e.currentTarget.value)}} />
            </div>        
            <div className='field'>
                <label>PASSWORD</label>
                <input type="password" value={pwd} onChange={(e)=>{ setPwd(e.currentTarget.value)}} />
            </div>        
            <div className='btns'>
                <div id="btn" onClick={()=>{onLoginLocal()}}><IoLogIn />&nbsp;LOGIN</div>
                <div id="btn" onClick={()=>{navigate('/joinForm')}}><IoCreateOutline />&nbsp;JOIN</div>
            </div>
            <div className='snslogin'>
                <button id="kakao" onClick={
                    ()=>{
                        window.location.href='http://localhost:8070/member/kakaostart';
                    }
                }>카카오로 시작하기</button>
            </div>
        </div>
        
    )
}

export default Login
