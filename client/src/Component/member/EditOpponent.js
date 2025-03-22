import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../../style/mypage.css'

import { useSelector, useDispatch } from 'react-redux';
import { loginAction, } from '../../store/userSlice';
import {Cookies} from 'react-cookie'

import jaxios from '../../util/jwtUtil';

const EditOpponent = () => {
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


    

    // ✅ 회원 정보 수정 요청
    async function onSubmit(){
        try{
            // 숫자 값으로 변환s
            const mbtiToNumber = {
                "E": "0", "I": "1",
                "N": "0", "S": "1",
                "T": "0", "F": "1",
                "J": "0", "P": "1"
                };    

                const numberValue = inputValue.split('').map(char => mbtiToNumber[char]).join('');

            try {
                // 서버에 데이터 전송
                const response = await jaxios.post('/api/member2/updateOpponentMBTI',null ,{ params:{numberValue,memberId:loginUser.memberId} });
                console.log(response.data); // 응답 처리
                
            } catch (error) {
            console.error('Error sending data:', error);
            }

            let result = await jaxios.post('/api/member2/updateOpponentHobbies',{
                memberId:loginUser.memberId,
                // ✅ 선택한 취미 전송
                hobbies: selectedHobbies,
            });

            if(result.data.msg =='ok'){
                alert('상대 정보 수정이 완료되었습니다.')
                const res = await jaxios.get('/api/member/getLoginUser');
                cookies.set('user', JSON.stringify( res.data.loginUser ) , {path:'/', })
                dispatch( loginAction( res.data.loginUser ) )
                // navigate('/myPage');
            }
        }catch(err){  console.error(err);     }
    }


    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const mbtiList = [
        "INTJ", "INTP", "ENTJ", "ENTP",
        "INFJ", "INFP", "ENFJ", "ENFP",
        "ISTJ", "ISFJ", "ESTJ", "ESFJ",
        "ISTP", "ISFP", "ESTP", "ESFP"
    ];
  

const handleChange = (event) => {
    const value = event.target.value.toUpperCase();
    setInputValue(value);
    
    if (value) {
        const filteredList = mbtiList.filter(mbti => mbti.startsWith(value));
        setSuggestions(filteredList);
    } else {
        setSuggestions([]);
    }
};

    function calMBTI(ei,ns,tf,jp){
        var m
        var b
        var t
        var i;


        if(ei==0){m= "E"}
        else{m= "I"};

        if(ns==0){b= "N"}
        else{b= "S"};

        if(tf==0){t= "T"}
        else{t= "F"};

        if(jp==0){i= "J"}
        else{i= "P"};
    return m+b+t+i;
    }

    return (
        <div className='profileContainer'>
            <div className='editForm opp-edit'>
                <h2>Opponent EDIT</h2>
                <div className='opp-header'>
                    <label>MBTI</label>
                </div>
                <div className='hobby-field'>
                    <div className='hobby-list'>
                    상대 MBTI : {calMBTI(loginUser.opponentMemberInfo.ei,loginUser.opponentMemberInfo.ns,loginUser.opponentMemberInfo.tf,loginUser.opponentMemberInfo.jp)}
                        <input 
                            type="text" 
                            value={inputValue} 
                            onChange={handleChange} 
                            placeholder="MBTI 입력"
                        />
                        {suggestions.length > 0 && (
                        <ul>
                            {suggestions.map((suggestion, index) => (
                            <li 
                                key={index}
                            >
                                {suggestion}
                            </li>
                            ))}
                        </ul>
                        )}
                    </div> 
                </div>

                <div className='btns'>
                    <button id='opp-btn' onClick={ ()=>{   onSubmit()    }  }>EDIT</button>
                </div>
            </div>
        </div>
    )
}

export default EditOpponent
