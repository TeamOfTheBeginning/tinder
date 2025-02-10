import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { loginAction, setFollowers, setFollowings } from '../store/userSlice';
import {Cookies} from 'react-cookie'

import '../style/mystargram.css'
import '../style/login.css'
import { IoIosLogIn } from "react-icons/io";


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

                console.log('login success');

                // const res = await axios.get('/api/member/getLoginUser');
                // const lUser = res.data.loginUser;
                
                // lUser['followings'] = res.data.followings;
                // lUser['followers'] = res.data.followers;
                // cookies.set('user', JSON.stringify( lUser ) , {path:'/', })
                
                // cookies.set('followers', JSON.stringify( res.data.followers ) , {path:'/', })
                // cookies.set('followings', JSON.stringify( res.data.followings ) , {path:'/', })
                
                // dispatch( loginAction( res.data.loginUser ) )
                // dispatch( setFollowers( res.data.followers ) )
                // dispatch( setFollowings( res.data.followings ) )

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
                <div id="btn" onClick={()=>{onLoginLocal()}}><IoIosLogIn />LOGIN</div>
                <div id="btn" onClick={()=>{navigate('/joinForm')}}>JOIN</div>
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
