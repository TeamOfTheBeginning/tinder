import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import SideBar from '../SideBar';
import '../../style/mypage.css'

import { useSelector, useDispatch } from 'react-redux';
import { loginAction, } from '../../store/userSlice';
import {Cookies} from 'react-cookie'

const EditProfile = () => {
    const loginUser = useSelector( state=>state.user );
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [pwdChk, setPwdChk ] = useState('')
    const [nickname, setNickname] = useState('')
    const [gender, setGender] = useState('')
    const [age, setAge] = useState('')
    const [phone, setPhone] = useState('')
    const [hobby, setHobby] = useState('')
    const [hobbyCategories, setHobbyCategories] = useState([]); // 취미 카테고리 목록
    const [hobbies, setHobbies] = useState([]); // 취미 목록
    const [selectedHobbies, setSelectedHobbies] = useState([]); // 사용자가 선택한 취미
    const [intro, setIntro] = useState('')
    const [zipnum, setZipnum] = useState('')
    const [profileImg, setProfileImg] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [imgSrc, setImgSrc] = useState('')
    const [imgStyle, setImgStyle] = useState({display:"none"});
    const navigate = useNavigate();
    const [word, setWord] = useState('n')
    const dispatch = useDispatch();
    const cookies = new Cookies()
    const navigateWithinSideViewer = (path) => {
        navigate(path); // 경로 이동만 수행하고 SideViewer 상태는 유지
    };

    
    const handleBirthDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const today = new Date();

        let calculatedAge = today.getFullYear() - selectedDate.getFullYear();
        const monthDiff = today.getMonth() - selectedDate.getMonth();
        const dayDiff = today.getDate() - selectedDate.getDate();
        
        if (selectedDate > today) {
            alert("미래 날짜는 선택할 수 없습니다.");
            return;
        }
        
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            calculatedAge--;
        }

        setBirthDate(e.target.value);
        setAge(calculatedAge);
    };
    

    useEffect(() => {
        axios.get("/api/member/hobbies")
            .then((response) => {
                setHobbyCategories(response.data.categories); // 카테고리 설정
                setHobbies(response.data.hobbies); // 취미 설정
                
                // 기존 선택된 취미 초기화 (로그인 유저의 데이터에서 가져옴)
                if (loginUser.hobbies) {
                    const initialSelectedHobbies = loginUser.hobbies.map((h) => h.hobbyId);
                    setSelectedHobbies(initialSelectedHobbies);
                }
            });
    
        setAge(loginUser.age);
        setBirthDate(loginUser.birthDate);
        setZipnum(loginUser.zipnum);
        setGender(loginUser.gender);
        setEmail(loginUser.email);
        setNickname(loginUser.nickname);
        setPhone(loginUser.phone);
        setHobby(loginUser.hobby);
        setIntro(loginUser.profileMsg);
    
        if (loginUser.profileImg) {
            setImgSrc(`http://localhost:8070/userimg/${loginUser.profileImg}`);
            setImgStyle({ display: 'block', width: '200px' });
        }
    
        setProfileImg(loginUser.profileImg);
    }, []);
    

    // ✅ 취미 선택 핸들러
    const handleHobbyChange = (hobbyId) => {
        setSelectedHobbies((prev) =>
            prev.includes(hobbyId)
                ? prev.filter((id) => id !== hobbyId) // 체크 해제 시 제거
                : [...prev, hobbyId] // 체크 시 추가
        );
      };
      

    async function fileUpload(e){
        const formData = new FormData();
        formData.append('image',  e.target.files[0]);
        const result = await axios.post('/api/member/fileupload', formData);
        setImgSrc(`http://localhost:8070/userimg/${result.data.filename}`);
        setImgStyle({display:"block", width:"200px"});
        setProfileImg(result.data.filename)
    }

    // ✅ 회원 정보 수정 요청
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
            result = await axios.post('/api/member/update', {
                memberId:loginUser.memberId, email, pwd, age, birthDate, gender, nickname, phone, zipnum, profileMsg:intro, profileImg,                 
            });

            let result2 = await axios.post('/api/member/updateHobbies',{
                memberId:loginUser.memberId,
                // ✅ 선택한 취미 전송
                hobbies: selectedHobbies,
            });

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
        <div className='Container'>
            <SideBar  setWord={setWord}/>
            <div className='loginform'>
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
                    <label style={{flex:2}}>GENDER</label>
                    <select style={{flex:3}} value={gender} onChange={(e)=>{setGender(e.currentTarget.value)}}>
                        <option value='0'>남성</option>    
                        <option value='1'>여성</option>
                    </select>
                    <label style={{flex:2}}>BIRTHDATE</label>
                    <input
                        style={{flex:3}}
                        type="date"
                        value={birthDate}
                        onChange={handleBirthDateChange}
                        required
                    />
                </div>
                <div className='field'>
                    <label>PHONE</label>
                    <input type="text"  value={phone} onChange={(e)=>{setPhone(e.currentTarget.value)}}/>
                </div>
                <div className='field'>
                    <label>ADDRESS</label>
                    <input type="text"  value={zipnum} onChange={(e)=>{setZipnum(e.currentTarget.value)}}/>
                </div>
                <div className='field'>
                    <label>INTRO</label>
                    <input type="text"  value={intro} onChange={(e)=>{setIntro(e.currentTarget.value)}}/>
                </div>

                <div className="field">
                    <label>HOBBY</label>
                    <div id="hobby-container">
                        {hobbyCategories.map((category) => (
                            <div key={category.categoryId}>
                                <h4>{category.categoryName}</h4>
                                {hobbies.filter((h) => h.category.categoryId === category.categoryId).map((h) => (
                                    <label key={h.hobbyId}>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedHobbies.includes(h.hobbyId)} 
                                            onChange={() => handleHobbyChange(h.hobbyId)} 
                                        />
                                        {h.hobbyName}
                                    </label>
                                ))}
                            </div>
                        ))}
                    </div>
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
        </div>
    )
}

export default EditProfile
