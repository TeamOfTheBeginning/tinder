import React, {useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import DaumPostcode from 'react-daum-postcode';
import axios from "axios";
import '../../style/login.css';
import AddressModal from './AddressModal';

const JoinForm = () => {

    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [pwdChk, setPwdChk ] = useState('')
    const [nickname, setNickname] = useState('')
    const [gender, setGender] = useState('')
    const [age, setAge] = useState('')
    const [phone, setPhone] = useState('')
    const [intro, setIntro] = useState('')
    const [address, setAddress] = useState('');
    const [zipnum, setZipnum] = useState('')
    const [profileimg, setProfileimg] = useState('')
    const [imgSrc, setImgSrc] = useState('')
    const [imgStyle, setImgStyle] = useState({display:"none"});
    const [birthDate, setBirthDate] = useState('');
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');


    const convertAddressToCoordinates = (address) => {
        return new Promise((resolve, reject) => {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(address, (result, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    resolve({
                        latitude: result[0].y,
                        longitude: result[0].x
                    });
                } else {
                    reject(new Error('주소를 변환할 수 없습니다.'));
                }
            });
        });
    };

        const handleComplete = async (data) => {
            let fullAddress = data.address;
            let extraAddress = '';

            if (data.addressType === 'R') {
                if (data.bname !== '') {
                    extraAddress += data.bname;
                }
                if (data.buildingName !== '') {
                    extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
                }
                fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
            }

            setZipnum(data.zonecode);
            setAddress(fullAddress);
            try {
                const coordinates = await convertAddressToCoordinates(fullAddress);
                setLatitude(coordinates.latitude);
                setLongitude(coordinates.longitude);
            } catch (error) {
                console.error('주소 변환 중 오류 발생:', error);
                alert('주소를 좌표로 변환하는 데 실패했습니다.');
            }
            setIsAddressModalOpen(false);
        };
    const navigate = useNavigate();

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

    async function onSubmit(){
        console.log(longitude)
        console.log(latitude)
        console.log(address)
        if(email==''){ return alert('이메일을 입력하세요');}
        if(pwd==''){ return alert('패스워드를 입력하세요');}
        if(pwd!==pwdChk){ return alert('패스워드 확인이 일치하지 않습니다');}
        if(nickname==''){ return alert('닉네임을 입력하세요');}
        if(age<18){return alert('만 18세 이상만 가입 가능합니다');}
        try{
            let result = await axios.post('/api/member/emailcheck', null, {params:{email}} );
            if(result.data.msg == 'no' ){
                return alert('이메일이 중복됩니다');
            }
            result = await axios.post('/api/member/nicknamecheck', null, {params:{nickname}} );
            if(result.data.msg == 'no' ){
                return alert('닉네임이 중복됩니다');
            }
            result = await axios.post('/api/member/join', {email, pwd, age, gender, nickname, phone, birthDate , address, latitude, longitude, profileMsg : intro, profileImg :profileimg, zipnum});
            if(result.data.msg =='ok'){
                alert('회원 가입이 완료되었습니다. 로그인하세요');
                navigate('/');
            }
        }catch(err){  console.error(err);     }
    }

    async function fileUpload(e){
        const formData = new FormData();
        formData.append('image',  e.target.files[0]);
        const result = await axios.post('/api/member/fileupload', formData);
        console.log(result);
        setImgSrc(`http://localhost:8070/userImg/${result.data.filename}`);
        setImgStyle({display:"block", width:"200px"});
        setProfileimg(result.data.filename)
    }

    return (
        <div className='join-form-container'>
            <div className='loginform'>
                <div className="logo" style={{fontSize:"2.0rem"}}>Member Join</div>
                <div className='field'>
                    <label>E-MAIL</label>
                    <input type="text" value={email} onChange={(e)=>{setEmail(e.currentTarget.value)}}/>
                </div>
                <div className='field'>
                    <label>PASSWORD</label>
                    <input type="password"  value={pwd} onChange={(e)=>{setPwd(e.currentTarget.value)}}/>
                </div>
                <div className='field'>
                    <label>RETYPE PW</label>
                    <input type="password"  value={pwdChk} onChange={(e)=>{setPwdChk(e.currentTarget.value)}}/>
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
                    <input style={{flex:'3.2'}} type="text" value={zipnum} readOnly placeholder="우편번호" />
                    <button onClick={() => setIsAddressModalOpen(true)}>주소 검색</button>
                </div>
                <div className='field'>
                    <label style={{flex:1}}></label>
                    <input type="text" value={address} readOnly placeholder="주소" />
                    
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
                    <div id="btn" onClick={ ()=>{   onSubmit()    }  }>JOIN</div>
                    <div id="btn" onClick={ ()=>{ navigate('/')   }  }>BACK</div>
                </div>
            </div>
            <AddressModal 
                    isOpen={isAddressModalOpen}
                    onClose={() => setIsAddressModalOpen(false)}
                    onComplete={handleComplete}
            />
        </div>
                
                
        
    )

    
}



export default JoinForm
