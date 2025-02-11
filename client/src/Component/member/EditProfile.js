import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import MainMenu from '../MainMenu';

import { useSelector, useDispatch } from 'react-redux';
import { loginAction, } from '../../store/userSlice';
import {Cookies} from 'react-cookie'

const EditProfile = () => {
    const loginUser = useSelector( state=>state.user );
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [pwdChk, setPwdChk ] = useState('')
    const [nickname, setNickname] = useState('')
    const [phone, setPhone] = useState('')
    const [intro, setIntro] = useState('')
    const [profileImg, setProfileImg] = useState('')
    const [imgSrc, setImgSrc] = useState('')
    const [imgStyle, setImgStyle] = useState({display:"none"});
    const navigate = useNavigate();
    const [word, setWord] = useState('n')
    const dispatch = useDispatch();
    const cookies = new Cookies()

    

    useEffect(
        ()=>{
            setEmail( loginUser.email )
            setNickname( loginUser.nickname )
            setPhone( loginUser.phone )
            setIntro( loginUser.profileMsg )
            if( loginUser.profileImg ){
                setImgSrc(`http://localhost:8070/userimg/${loginUser.profileImg}`)
                setImgStyle({display:'block', width:'200px'})
            }
            setProfileImg(loginUser.profileImg);
        }, []
    )

    async function fileUpload(e){
        const formData = new FormData();
        formData.append('image',  e.target.files[0]);
        const result = await axios.post('/api/member/fileupload', formData);
        setImgSrc(`http://localhost:8070/userimg/${result.data.filename}`);
        setImgStyle({display:"block", width:"200px"});
        setProfileImg(result.data.filename)
    }

    async function onSubmit(){
        if(email==''){ return alert('이메일을 입력하세요');}
        if(loginUser.provider != 'kakao' && pwd==''){ return alert('패스워드를 입력하세요');}
        if(loginUser.provider != 'kakao' && pwd!==pwdChk){ return alert('패스워드 확인이 일치하지 않습니다');}
        if(nickname==''){ return alert('닉네임을 입력하세요');}
        try{
            let result = await axios.post('/api/member/emailcheckUpdate', null, {params:{email}} );
            if(result.data.msg == 'no' ){
                return alert('이메일이 중복됩니다');
            }
            result = await axios.post('/api/member/nicknamecheckUpdate', null, {params:{nickname}} );
            if(result.data.msg == 'no' ){
                return alert('닉네임이 중복됩니다');
            }
            result = await axios.post('/api/member/update', {memberId:loginUser.memberId, email, pwd, nickname, phone, profileMsg:intro, profileImg });
            if(result.data.msg =='ok'){
                alert('회원 정보 수정이 완료되었습니다.')

                const res = await axios.get('/api/member/getLoginUser');
                cookies.set('user', JSON.stringify( res.data.loginUser ) , {path:'/', })
                dispatch( loginAction( res.data.loginUser ) )
                navigate('/myPage');
            }
        }catch(err){  console.error(err);     }
    }

    return (
        <div className='loginform'>
            <MainMenu  setWord={setWord}/>
            <div className="logo" style={{fontSize:"2.0rem"}}>MEMBER EDIT</div>
            <div className='field'>
                <label>E-MAIL</label>
                <input type="text" value={email} onChange={(e)=>{setEmail(e.currentTarget.value)}}/>
            </div>
            <div className='field'>
                <label>PASSWORD</label>
                <input type="password" onChange={(e)=>{setPwd(e.currentTarget.value)}}/>
            </div>
            <div className='field'>
                <label>RETYPE PW</label>
                <input type="password" onChange={(e)=>{setPwdChk(e.currentTarget.value)}}/>
            </div>
            <div className='field'>
                <label>NICKNAME</label>
                <input type="text"  value={nickname} onChange={(e)=>{setNickname(e.currentTarget.value)}}/>
            </div>
            <div className='field'>
                <label>PHONE</label>
                <input type="text"  value={phone} onChange={(e)=>{setPhone(e.currentTarget.value)}}/>
            </div>
            <div className='field'>
                <label>INTRO</label>
                <input type="text"  value={intro} onChange={(e)=>{setIntro(e.currentTarget.value)}}/>
            </div>
            <div className='field'>
                <label>PROFILE IMG</label>
                <input type="file" onChange={(e)=>{fileUpload(e)}}/>
            </div>
            <div className='field'>
                <label>Profile img preview</label>
                <div><img src={imgSrc} style={imgStyle} /></div>
            </div>

            <div className='btns'>
                <button onClick={ ()=>{   onSubmit()    }  }>EDIT</button>
                <button onClick={ ()=>{ navigate('/myPage')   }  }>BACK</button>
            </div>
        </div>
    )
}

export default EditProfile
