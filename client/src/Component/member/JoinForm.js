import React, {useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import DaumPostcode from 'react-daum-postcode';
import axios from "axios";
import * as PortOne from "@portone/browser-sdk/v2";
import '../../style/login.css';
import AddressModal from './AddressModal';

const JoinForm = () => {

    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [pwdChk, setPwdChk ] = useState('')
    const [memberName,setMemberName] = useState('')
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
    const [adultVerification, setAdultVerification] = useState(false);

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


    async function onSubmit(){
        console.log(longitude)
        console.log(latitude)
        console.log(address)
        if(!adultVerification){ return alert('성인인증을 해주세요')}
        if(email==''){ return alert('이메일을 입력하세요');}
        if(pwd==''){ return alert('패스워드를 입력하세요');}
        if(pwd!==pwdChk){ return alert('패스워드 확인이 일치하지 않습니다');}
        if(nickname==''){ return alert('닉네임을 입력하세요');}
        // if(age<18){return alert('만 18세 이상만 가입 가능합니다');}
        try{
            let result = await axios.post('/api/member/emailcheck', null, {params:{email}} );
            if(result.data.msg == 'no' ){
                return alert('이메일이 중복됩니다');
            }
            result = await axios.post('/api/member/nicknamecheck', null, {params:{nickname}} );
            if(result.data.msg == 'no' ){
                return alert('닉네임이 중복됩니다');
            }
            result = await axios.post('/api/member/join', {email, pwd, age, gender, nickname, memberName, phone, birthDate , address, latitude, longitude, profileMsg : intro, profileImg :profileimg, zipnum});
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
        setImgSrc(`http://localhost:8070/userimg/${result.data.filename}`);
        setImgStyle({display:"block", width:"200px"});
        setProfileimg(result.data.filename)
    }


    const handleIdentityVerification = async () => {
        try {
            const response = await PortOne.requestIdentityVerification({
            // 고객사 storeId로 변경해주세요.
            storeId: "store-0ef99292-e8d5-4956-a265-e1ec0ee73634",
            identityVerificationId: `identity-verification-${crypto.randomUUID()}`,
            // 연동 정보 메뉴의 채널 관리 탭에서 확인 가능합니다.
            channelKey: "channel-key-a6f549c2-b895-4933-ad92-117931b006a5",
        });

        console.log('결제 요청 응답:', response);
        console.log('결제 요청 응답:', JSON.stringify(response));

        if (response.code !== undefined) {
            return alert(response.message);
        }

        const verificationResult = await fetch('/api/identityVerifications/verifyIdentity1', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                identityVerificationId:response.identityVerificationId,
            }),
        })
        .then(response => response.json())
            .then(data => {
                console.log("서버 응답:", data); // 디버깅용

                // 응답 데이터 처리
                if (data.message === "Age restriction satisfied") {
                // console.log("성인 인증 성공!");
                // console.log("Name:", data.name);
                // console.log("Gender:", data.gender);
                // console.log("BirthDate:", data.birthDate);

                alert("성인 인증 성공!");
                setAdultVerification(true)
                setMemberName(data.name)
                setPhone(data.phoneNumber)
                setBirthDate(data.birthDate)

                if(data.gender==='MALE'){setGender(0)}
                else if(data.gender==='FEMALE'){setGender(1)}
                else{
                    console.log("성별 오류")
                }


                }
                else if (data.message === "Age restriction not satisfied") {
                    console.log("성인 인증 실패!");
                } else if (data.message === "Verification Failed") {
                console.log("인증 실패!");
                } else if (data.message === "API Error") {
                console.log("API 오류 발생!");
                } else if (data.message === "API Request Failed") {
                console.log("API 요청 실패!");
                }

                return data; // data를 반환하여 외부에서 사용할 수 있도록 함
            })
            .catch(error => {
                console.error('Error:', error);
            });

        console.log("verificationResult: " + JSON.stringify(verificationResult));


    } catch (error) {
    console.error('본인 인증 오류:', error);
    } finally {}
};

    return (
        <div className='join-form-container'>
            <div className='loginform'>
                <div className="logo" style={{fontSize:"2.0rem"}}>Member Join</div>
                {/* <div className='field'>
                    <label>성인인증</label>*/}
                    <div className='btns'> 
                        <div id="btn" onClick={ ()=>{   handleIdentityVerification()    }  }>성인인증</div>
                    </div>
                {/*</div> */}
                <div className='field'>
                    <label>NAME</label>
                    <input type="text"  value={memberName} onChange={(e)=>{setNickname(e.currentTarget.value)}} readOnly/>
                </div>
                <div className='field'>
                    <label style={{flex:2}}>GENDER</label>
                    {/* 직접 선택하게 할 경우 */}
                    {/* <select style={{flex:3}} value={gender} onChange={(e)=>{setGender(e.currentTarget.value)}} readOnly>
                        
                        <option value='0'>남성</option>
                        <option value='1'>여성</option>
                    </select> */}

                    {/* 인증시 받아오는 경우 */}
                    <input
                    style={{ flex: 2 }}
                    type="text"
                    value={gender === "" || gender === null || gender === undefined ? "" : gender === 0 ? "남성" : "여성"}
                    readOnly
                    />

                    <label style={{flex:2}}>&nbsp;&nbsp;BIRTHDATE&nbsp;&nbsp;</label>
                    
                    {/* 수정 불가능 하게 할 경우 */}
                    <input
                    type="date" // type을 date로 변경
                    value={birthDate}
                    required
                />

                    {/* 수정 가능하게 할 경우 */}
                    {/* <input
                        style={{flex:3}}
                        type="date"
                        value={birthDate}
                        onChange={handleBirthDateChange}
                        required
                    /> */}

                </div>
                <div className='field'>
                    <label>PHONE</label>
                    <input type="text"  value={phone} onChange={(e)=>{setPhone(e.currentTarget.value)}} readOnly/>
                </div>
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
                    {/* <div id="btn" onClick={ ()=>{   handleIdentityVerification()    }  }>성인인증</div> */}
                    <div id="btn" onClick={ ()=>{   onSubmit()    }  }>JOIN</div>
                    <div id="btn" onClick={ ()=>{ navigate('/')   }  }>BACK</div>
                </div>
                <AddressModal
                        isOpen={isAddressModalOpen}
                        onClose={() => setIsAddressModalOpen(false)}
                        onComplete={handleComplete}
                />
            </div>
        </div>



    )


}



export default JoinForm
