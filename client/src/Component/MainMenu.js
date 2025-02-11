import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { loginAction, logoutAction, setFollowers, setFollowings } from '../store/userSlice';
import {Cookies} from 'react-cookie'

import { CgProfile } from "react-icons/cg";
import { IoHomeSharp, IoSparkles, IoSearch, IoLogOut } from "react-icons/io5";
import '../style/MainMenu.css'

const MainMenu=( props ) => {

    const cookies = new Cookies()

    const [imgSrc, setImgSrc] = useState('http://localhost:8070/img/user.png');
    const loginUser = useSelector( state=>state.user)
    const navigate =useNavigate();
    const [inputStyle, setInputStyle] = useState({display:'flex', padding:'5px 10px', marginBottom:'10px'})
    const [viewVal, setViewVal] = useState(false)
    const [searchTag, setSearchTag] = useState('')
    const dispatch = useDispatch();

    
    // useEffect(
    //     ()=>{
    //         console.log('loginUser', loginUser)
    //         if( !loginUser || !loginUser.email ){
    //             alert('로그인이 필요한 서비스 입니다');
    //             navigate('/')
    //         }else{
    //             //console.log('loginUser : ', loginUser)
    //             if( loginUser.profileimg ){
    //                 setImgSrc(`http://localhost:8070/userImg/${loginUser.profileimg}`);
    //             }
    //         }
    //     },[]
    // )

    function onLogout(){
        axios.get('/api/member/logout')
        .then((result)=>{
            dispatch( logoutAction() );
            cookies.remove('user', {path:'/',} )
            navigate('/')
        }).catch((err)=>{console.error(err)})
    }

    useEffect(
        ()=>{
            if( viewVal){
                setInputStyle({display:'flex', padding:'5px 10px', marginBottom:'10px'})
            }else{
                setInputStyle({display:'none'})
            }
        }, [viewVal]
    )

    function viewOrNot(){
        setViewVal( !viewVal )
    }
    

    function onSearch(){
        if(!searchTag || searchTag==''){ 
            props.setWord('') 
        }else{
            props.setWord( searchTag )
        }
    }

    return (
        <div className='topmenu'>
            <div className='profile'>
                <div id='btn'></div><span>&nbsp;사용자 이름이 들어감</span>
            </div>
            <div className='menu'>
                <div id='btn' onClick={
                    ()=>{navigate('/main')}
                }><IoHomeSharp /></div>
                {/* <div id='btn' onClick={
                    ()=>{navigate('/writePost')}
                }><CgAddR /></div> */}
                <div id='btn' onClick={
                    ()=>{navigate('/match')}
                }><IoSparkles /></div>
                <div id='btn' onClick={
                    ()=>{navigate('/')}
                }><IoSearch /></div>
                <div id='btn' onClick={
                    ()=>{navigate('/mypage')}
                }><CgProfile /></div>
                <div id='btn' onClick={
                    ()=>{ 
                        onLogout(); 
                        // navigate('/#')
                    }
                }><IoLogOut /></div>
            </div>

        </div>
    )
}

export default MainMenu
