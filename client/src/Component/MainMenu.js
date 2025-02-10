import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { loginAction, logoutAction, setFollowers, setFollowings } from '../store/userSlice';
import {Cookies} from 'react-cookie'

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
    //                 setImgSrc(`http://localhost:8070/userimg/${loginUser.profileimg}`);
    //             }
    //         }
    //     },[]
    // )

    function onLogout(){
        // axios.get('/api/member/logout')
        // .then((result)=>{
        //     dispatch( logoutAction() );
        //     cookies.remove('user', {path:'/',} )
        //     navigate('/')
        // }).catch((err)=>{console.error(err)})
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
        <div>
            <div className='topmenu'>
                <img src='http://localhost:8070/img/home.png' onClick={
                    ()=>{navigate('/main')}
                }/>
                <img src='http://localhost:8070/img/write.png' onClick={
                    ()=>{navigate('/writePost')}
                }/>
                <img src='http://localhost:8070/img/search.png' onClick={()=>{viewOrNot()}}/>
                <img src={imgSrc} onClick={()=>{ navigate('/myPage') }}/>
                <img src="http://localhost:8070/img/logout.png" onClick={
                    ()=>{ onLogout(); }
                }/>
            </div>
            <div className='search' style={inputStyle}>
                {/* 화면에 없다가 검색버튼을 누르면 나타나는 검색어 입력창 */}
                <input type="text" style={{flex:'5'}} value={searchTag} onChange={
                    (e)=>{ setSearchTag( e.currentTarget.value) } 
                }/>
                <button style={{flex:'1'}} onClick={()=>{ onSearch() }}>해시테그 검색</button>
            </div>
        </div>
    )
}

export default MainMenu
