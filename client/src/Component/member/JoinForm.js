import React, {useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import DaumPostcode from 'react-daum-postcode';
import * as PortOne from '@portone/browser-sdk/v2';
import '../../style/login.css';
import { IoCreateOutline } from 'react-icons/io5';
import AddressModal from './AddressModal';
import { useSearchParams } from "react-router-dom";

import axios from 'axios';
import jaxios from '../../util/jwtUtil';

const JoinForm = (props) => {

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
    const [imgStyle, setImgStyle] = useState({display:'none'});
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
        sessionStorage.removeItem("isSignUp");
        console.log(longitude)
        console.log(latitude)
        console.log(address)
        if(!adultVerification){ return alertAndScroll('성인인증을 해주세요', 'adultVerification');}
        if(email===''){ return alertAndScroll('이메일을 입력하세요', 'email');}
        if(pwd===''){ return alertAndScroll('패스워드를 입력하세요', 'pwd');}
        if(pwd!==pwdChk){ return alertAndScroll('패스워드 확인이 일치하지 않습니다', 'pwdChk');}
        if(nickname===''){ return alertAndScroll('닉네임을 입력하세요', 'nickname');}
        if(zipnum===''||address===''){ return alertAndScroll('주소 검색을 하세요', 'zipnum');}
        if (intro.length > 255) {
            alertAndScroll('자기소개는 255자 이하로 작성해주세요.', 'intro');
            return;
        }
        if(profileimg===''){ return alertAndScroll('프로필 이미지를 업로드 하세요', 'profileimg');}

        try{
            let result = await axios.post('/api/member/emailcheck', null, {params:{email}} );
            if(result.data.msg === 'no' ){
                return alertAndScroll('이메일이 중복됩니다', 'email');
            }
            result = await axios.post('/api/member/nicknamecheck', null, {params:{nickname}} );
            if(result.data.msg === 'no' ){
                return alertAndScroll('닉네임이 중복됩니다', 'nickname');
            }
            result = await axios.post('/api/member/join', {email, pwd, age, gender, nickname, memberName, phone, birthDate , address, latitude, longitude, profileMsg : intro, profileImg :profileimg, zipnum});
            if(result.data.msg ==='ok'){
                alert('회원 가입이 완료되었습니다. 로그인하세요');
                window.location.reload();
            }
        }catch(err){  console.error(err);     }
    }

    const handleIntroChange = (e) => {
        let value = e.target.value;
        if (value.length > 255) {
            alertAndScroll('자기소개는 255자 이하로 작성해주세요.(공백 포함', 'intro');
            value = value.slice(0, 255);
        }
        setIntro(value);
    };

    // 검증 오류 alert 후 해당 입력창으로 스크롤 이동하는 함수
    const alertAndScroll = (message, fieldId) => {
        alert(message);
        const element = document.getElementById(fieldId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
        }
    };

    async function fileUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            const result = await axios.post('/api/member/fileupload', formData);
            setImgSrc(`${process.env.REACT_APP_ADDRESS2}/userimg/${result.data.filename}`);
            setImgStyle({display:'block', width:'200px'});
            setProfileimg(result.data.filename);
        } else {
            setImgSrc('');
            setImgStyle({display:'none'});
            setProfileimg('');
        }
    }

    const uuid = () => {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    };


    const handleIdentityVerification = async () => {
        // alert("JoinForm isSignUp")
        sessionStorage.setItem("isSignUp", "true");

        try {
            const response = await PortOne.requestIdentityVerification({
            // 고객사 storeId로 변경해주세요.
            storeId: 'store-0ef99292-e8d5-4956-a265-e1ec0ee73634',
            identityVerificationId: `identity-verification-${uuid()}`,
            // 연동 정보 메뉴의 채널 관리 탭에서 확인 가능합니다.
            channelKey: 'channel-key-a6f549c2-b895-4933-ad92-117931b006a5',
            redirectUrl: window.location.origin,
        });

        console.log('결제 요청 응답:', response);
        console.log('결제 요청 응답:', JSON.stringify(response));

        if (response.code !== undefined) {
            return alert(response.message);
        }

        const verificationResult = await fetch('/api/identityVerifications/verifyIdentity1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                identityVerificationId:response.identityVerificationId,
            }),
        })
        .then(response => response.json())
            .then(data => {
                console.log('서버 응답:', data); // 디버깅용

                // 응답 데이터 처리
                if (data.message === 'Age restriction satisfied') {

                alert('성인 인증 성공!');
                setAdultVerification(true)
                setMemberName(data.name)
                setPhone(data.phoneNumber)
                setBirthDate(data.birthDate)
                setAge(parseInt(data.age, 10))

                if(data.gender==='MALE'){setGender(0)}
                else if(data.gender==='FEMALE'){setGender(1)}
                else{
                    console.log('성별 오류')
                }


                }
                else if (data.message === 'Age restriction not satisfied') {
                    console.log('성인 인증 실패!');
                } else if (data.message === 'Verification Failed') {
                console.log('인증 실패!');
                } else if (data.message === 'API Error') {
                console.log('API 오류 발생!');
                } else if (data.message === 'API Request Failed') {
                console.log('API 요청 실패!');
                }

                return data; // data를 반환하여 외부에서 사용할 수 있도록 함
            })
            .catch(error => {
                console.error('Error:', error);
            });

        console.log('verificationResult: ' + JSON.stringify(verificationResult));


    } catch (error) {
    console.error('본인 인증 오류:', error);
    } finally {}
};



    const [searchParams, setSearchParams] = useSearchParams();

    const identityVerificationId = searchParams.get("identityVerificationId");
    const code = searchParams.get("code");
    const message = searchParams.get("message");

    useEffect(() => {
        if (code) {
            alert(`본인인증 실패: ${message}`);
        } else if (identityVerificationId) {
            // 본인인증 성공 시 서버에 인증 완료 요청
            fetch('/api/identityVerifications/verifyIdentity1', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identityVerificationId }),
            })
            .then(response => response.json())
            .then(data => {
                console.log("서버 응답:", data); // 디버깅용

                // 응답 데이터 처리
                if (data.message === "Age restriction satisfied") {

                // console.log("setIsSignUp 실행됨!");
                // props.setIsSignUp(true);

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
            .catch(error => console.error("오류 발생:", error));
        }
    }, [identityVerificationId, code, message]);

    return (
        <div className='join-container'>
            <div className='login-btns'>
                <div className='login-btn' id='adultVerification' onClick={ ()=>{   handleIdentityVerification()    }  }>성인인증</div>
            </div>
            <div className='joinform'>
                <div className='field'>
                    <label className='hidden'>NAME</label>
                    <input type='text' name='unsername' placeholder='이름' value={memberName} onChange={(e)=>{setMemberName(e.currentTarget.value)}} readOnly/>
                </div>

                <div className='field flex-row'>
                    <div className='gender'>
                    <label className='hidden'>GENDER</label>
                        {/* 인증시 받아오는 경우 */}
                        <input type='text' name='gender' placeholder='성별'
                        value={gender === '' || gender === null || gender === undefined ? '' : gender === 0 ? '남성' : '여성'}
                        readOnly
                    />
                    </div>

                    <div className='birth'>
                    <label className='hidden'>BIRTHDATE</label>
                        {/* 수정 불가능 하게 할 경우 */}
                        <input
                            type='text' // type을 date로 변경
                            name='birthdate'
                            placeholder='생년월일'
                            value={birthDate}
                            required
                        />
                    </div>
                </div>

                <div className='field'>
                    <label className='hidden'>PHONE</label>
                    <input type='text' name='phone' placeholder='전화번호' value={phone} onChange={(e)=>{setPhone(e.currentTarget.value)}} readOnly/>
                </div>
                <div className='field' id='email'>
                    <label className='hidden'>E-MAIL</label>
                    <input type='text' name='email' autoComplete='email' placeholder='E-MAIL (로그인 시 아이디로 사용됩니다.)' value={email} onChange={(e)=>{setEmail(e.currentTarget.value)}}/>
                </div>
                <div className='field'>
                    <label className='hidden' id='pwd'>PASSWORD</label>
                    <input type='password' name='password' autoComplete='new-password' placeholder='비밀번호' value={pwd} onChange={(e)=>{setPwd(e.currentTarget.value)}}/>
                </div>
                <div className='field'>
                    <label className='hidden' id='pwdChk'>RETYPE PW</label>
                    <input type='password' name='pwdchk' autoComplete='new-password' placeholder='비밀번호 확인' value={pwdChk} onChange={(e)=>{setPwdChk(e.currentTarget.value)}}/>
                </div>
                <div className='field' id='nickname'>
                    <label className='hidden'>NICKNAME</label>
                    <input type='text' name='nickname' placeholder='닉네임' value={nickname} onChange={(e)=>{setNickname(e.currentTarget.value)}}/>
                </div>
                <div className='field flex-row'>
                    <div className='zipnum'>
                        <label className='hidden'>ZIPNUM</label>
                        <input type='text' name='zipnum' value={zipnum} readOnly placeholder='우편번호' />
                    </div>
                    <div className='login-btn' onClick={() => setIsAddressModalOpen(true)}>
                        <label>주소 검색</label>
                        <button className='hidden' id='zipnum'>주소 검색</button>
                    </div>
                </div>
                <div className='field'>
                    <label className='hidden'>ADDRESS</label>
                    <input type='text' name='address' value={address} readOnly placeholder='주소' />

                </div>
                <div className='field' id='intro'>
                    <label className="hidden">INTRO</label>
                    <input type="text" placeholder="한마디" value={intro} onChange={handleIntroChange} />
                    <span className='profile-msg'>{intro.length} / 255</span>
                </div>
                <div className='field' id='profileimg'>
                    <label className='hidden'>PROFILE IMG</label>
                    <input type='file' name='profileimg' accept='.jpg,.jpeg,.png,.gif' onChange={(e)=>{fileUpload(e)}}/>
                    </div>
                    {imgSrc && (
                        <div className='field' id='prev'>
                            <label className='hidden'>Profile img preview</label>
                            <div className='prevImg'><img src={imgSrc} style={imgStyle} alt="Profile preview" /></div>
                        </div>
                    )}
                <AddressModal
                    isOpen={isAddressModalOpen}
                    onClose={() => setIsAddressModalOpen(false)}
                    onComplete={handleComplete}
                />
            </div>

            <div className='login-btns'>
                <div className='login-btn' onClick={ ()=>{   onSubmit()    }  }><IoCreateOutline />JOIN</div>
            </div>
        </div>



    )


}



export default JoinForm
