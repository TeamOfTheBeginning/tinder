import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import DaumPostcode from 'react-daum-postcode';
import * as PortOne from "@portone/browser-sdk/v2";
import '../../style/member/savekakaoinfo.css';
import { IoCreateOutline } from "react-icons/io5";
import AddressModal from './AddressModal';

import Loading from '../Loading';

import { useSearchParams } from "react-router-dom";

import { useDispatch } from 'react-redux';
import { loginAction, setFollower, setFollowed } from '../../store/userSlice';
import {Cookies, useCookies } from 'react-cookie'
import { useLocation } from 'react-router-dom';

import jaxios from '../../util/jwtUtil';
import { setCookie1, getCookie1 } from '../../util/cookieUtil2';
import { LuActivity } from 'react-icons/lu';

const Savekakaoinfo = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showModal, setShowModal] = useState(false);
    // const cookies = new Cookies()

    // useEffect(() => {
    //     // 현재 URL에서 쿼리 파라미터를 읽어오는 방법
        
    
    //     // 받은 데이터로 필요한 작업을 수행
    //     // 예: 데이터를 상태로 설정하거나 API 호출 등을 할 수 있습니다.
    // }, []);

    const [cookies, setCookie, removeCookie] = useCookies(['claims']);  // 쿠키 이름 배열로 전달
  const [claims, setClaims] = useState(null);

    useEffect(() => {
        // 'claims' 쿠키가 존재하면 상태에 저장
        if (cookies.claims) {
        let claimsObj;
    
        // 쿠키 값이 문자열이라면 JSON 파싱
        if (typeof cookies.claims === 'string') {
            try {
            claimsObj = JSON.parse(decodeURIComponent(cookies.claims));  // 쿠키 데이터 디코딩 및 파싱
            console.log(claimsObj);  // claims 객체를 출력
            } catch (error) {
            console.error("JSON 파싱 오류:", error);
            return;
            }
        } else {
            // console.log("이미 객체")
            // 이미 객체라면 바로 사용
            claimsObj = cookies.claims;
        }
        setClaims(claimsObj);  // 상태에 claims 저장

        // alert("사용자 정보를 입력해주세요(최초 1회)")

        setCookie1('user', JSON.stringify(claimsObj), 1);
        dispatch(loginAction(claimsObj));

        let accessToken = claimsObj.accessToken;
        let refreshToken = claimsObj.refreshToken;

        // console.log("accessToken"+accessToken)
        // console.log("claimsObj.nickname"+claimsObj.nickname)
        
        if(claimsObj.nickname&&claimsObj.zipnum&&claimsObj.birthDate){
            setShowModal(true);  // ✅ 배경을 어둡게 만드는 모달 표시

            // alert("로그인 완료. 메인페이지로 이동합니다.")      
                
            console.log("claimsObj.memberId"+claimsObj.memberId)
            jaxios.get(`/api/member/getLoginUser`, { params: { memberId:claimsObj.memberId } })
            .then((result) => {

            // console.log("result.data.loginUser"+result.data.loginUser)
            // console.log("accessToken2"+accessToken)

            result.data.loginUser.accessToken = accessToken;
            result.data.loginUser.refreshToken = refreshToken;

            setCookie1('user', JSON.stringify(result.data.loginUser) , 1)
            dispatch( loginAction( result.data.loginUser ) )
            
            const lUser = result.data.loginUser;
            lUser['follower'] = result.data.follower;
            lUser['followed'] = result.data.followed;
        
            dispatch(setFollower(result.data.follower));
            dispatch(setFollowed(result.data.followed));
        
            setCookie('follower', JSON.stringify(result.data.follower), { path: '/' });
            setCookie('followed', JSON.stringify(result.data.followed), { path: '/' });

            setIsLoginSuccess(true);

            // setTimeout(() => {
                // navigate('/main');
            // }, 200);
            }).catch((err) => { console.error(err) });  
        }

        
        } else {
        console.log("쿠키에 claims 데이터가 없습니다.");
        }
    }, []);  // 쿠키가 변경될 때마다 effect 실행
  


    const [email, setEmail] = useState('')
    // const [pwd, setPwd] = useState('')
    // const [pwdChk, setPwdChk ] = useState('')
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
            console.log(coordinates.latitude,coordinates.longitude)
        } catch (error) {
            console.error('주소 변환 중 오류 발생:', error);
            alert('주소를 좌표로 변환하는 데 실패했습니다.');
        }
        setIsAddressModalOpen(false);
    };


    async function onSubmit(){
        console.log(longitude)
        console.log(latitude)
        console.log(address)
        if(!adultVerification){ return alert('성인인증을 해주세요')}
        if(email===''){ return alert('이메일을 입력하세요');}
        if(nickname==''){ return alert('닉네임을 입력하세요');}
        if(zipnum==''||address==''){ return alert('주소 검색을 하세요');}
        if(profileimg==''){ return alert('프로필 이미지를 업로드 하세요');}
        
        try{            
            let result = await axios.post('/api/member/nicknamecheck', null, {params:{nickname}} );
            if(result.data.msg == 'no' ){
                return alert('닉네임이 중복됩니다');
            }
            console.log({
                memberId: claims.memberId, email:claims.email, age:age, birthDate:birthDate, gender, nickname, phone, zipnum, address, profileMsg: intro, profileImg:profileimg, latitude:latitude, longitude:longitude, memberName:memberName,
              })            
            result = await jaxios.post('/api/member/update', {
              memberId: claims.memberId, email:email, pwd:'a',age:age, birthDate:birthDate, gender, nickname, phone, zipnum, address, profileMsg: intro, profileImg:profileimg, latitude:latitude, longitude:longitude, memberName:memberName,
            });

            alert("가입완료.")      

            jaxios.get(`/api/member/getLoginUser`, { params: { memberId:claims.memberId } })
            .then((result) => {

            let accessToken=claims.accessToken
            let refreshToken=claims.refreshToken

            result.data.loginUser.accessToken = accessToken;
            result.data.loginUser.refreshToken = refreshToken;


            setCookie1('user', JSON.stringify(result.data.loginUser) , 1)
            dispatch( loginAction( result.data.loginUser ) )
        
        
            const lUser = result.data.loginUser;
            lUser['follower'] = result.data.follower;
            lUser['followed'] = result.data.followed;
        
            dispatch(setFollower(result.data.follower));
            dispatch(setFollowed(result.data.followed));
        
            setCookie('follower', JSON.stringify(result.data.follower), { path: '/' });
            setCookie('followed', JSON.stringify(result.data.followed), { path: '/' });
      
            // handleJoin(result.data.memberId);
            // localStorage.setItem('nickname', result.data.nickname);         
      
            // 2초 후에 /main으로 이동
            // setTimeout(() => {
            //     navigate('/main');
            // }, 2000);

            setIsLoginSuccess(true);

            }).catch((err) => { console.error(err) });  
        }catch(err){  console.error(err);     }
    }

    const handleLoadingComplete = () => {
        navigate('/main'); // 메인 페이지로 이동
        setLoadingComplete(true);
    };

    const [isLoginSuccess, setIsLoginSuccess] = useState(false);
    const [loadingComplete, setLoadingComplete] = useState(false);

    async function fileUpload(e){
        const formData = new FormData();
        formData.append('image',  e.target.files[0]);
        const result = await axios.post('/api/member/fileupload', formData);
        console.log(result); // 응답 데이터 확인
        console.log(result.data); // result.data가 실제로 존재하는지 확인
        setImgSrc(`http://localhost:8070/userimg/${result.data.filename}`);
        setImgStyle({display:"block", width:"200px"});
        setProfileimg(result.data.filename)
    }

    const uuid = () => {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    };

    const handleIdentityVerification = async () => {

        try {
            const response = await PortOne.requestIdentityVerification({
            // 고객사 storeId로 변경해주세요.
            storeId: "store-0ef99292-e8d5-4956-a265-e1ec0ee73634",
            identityVerificationId: `identity-verification-${uuid()}`,
            // 연동 정보 메뉴의 채널 관리 탭에서 확인 가능합니다.
            channelKey: "channel-key-a6f549c2-b895-4933-ad92-117931b006a5",
            redirectUrl: 'http://localhost:3000/savekakaoinfo',
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

                alert("성인 인증 성공!");
                setAdultVerification(true)
                setMemberName(data.name)
                setPhone(data.phoneNumber)
                setBirthDate(data.birthDate)
                setAge(parseInt(data.age, 10))

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
                    
                alert("성인 인증 성공!");
                setAdultVerification(true)
                setMemberName(data.name)
                setPhone(data.phoneNumber)
                setBirthDate(data.birthDate)
                setAge(parseInt(data.age, 10))

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
    <div>
{isLoginSuccess?(!loadingComplete ? (
                    <Loading onComplete={handleLoadingComplete} />
                ) : null)
:
(<>
<div className='join-container'>
    {showModal && (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>로그인 중입니다...</p>
            </div>
        </div>
    )}
            <div className='login-btns'>
                <div className="login-btn" onClick={ ()=>{   handleIdentityVerification()    }  }>성인인증</div>
            </div>
            <div className='joinform'>
                <div className='field'>
                    <label className="hidden">NAME</label>
                    <input type="text" placeholder="이름" value={memberName} onChange={(e)=>{setMemberName(e.currentTarget.value)}} readOnly/>
                </div>

                <div className='field flex-row'>
                    <div className='gender'>
                    <label className="hidden">GENDER</label>
                        {/* 인증시 받아오는 경우 */}
                        <input type="text" placeholder="성별"
                        value={gender === "" || gender === null || gender === undefined ? "" : gender === 0 ? "남성" : "여성"}
                        readOnly
                    />
                    </div>

                    <div className='birth'>
                    <label className="hidden">BIRTHDATE</label>
                        {/* 수정 불가능 하게 할 경우 */}
                        <input
                            type="text" // type을 date로 변경
                            placeholder="생년월일"
                            value={birthDate}
                            required
                    />
                    </div>
                </div>

                <div className='field'>
                    <label className="hidden">PHONE</label>
                    <input type="text" placeholder="전화번호" value={phone} onChange={(e)=>{setPhone(e.currentTarget.value)}} readOnly/>
                </div>

                <div className='field'>
                    <label className='hidden'>E-MAIL</label>
                    <input type='text' name='email' autoComplete='email' placeholder='E-MAIL (로그인 시 아이디로 사용됩니다.)' value={email} onChange={(e)=>{setEmail(e.currentTarget.value)}}/>
                </div>
                <div className='field'>
                    <label className="hidden">NICKNAME</label>
                    <input type="text" placeholder="닉네임" value={nickname} onChange={(e)=>{setNickname(e.currentTarget.value)}}/>
                </div>
                <div className='field flex-row'>
                    <div className='zipnum'>
                        <label className="hidden">ZIPNUM</label>
                        <input type="text" value={zipnum} readOnly placeholder="우편번호" />
                    </div>
                    <div className='login-btn' onClick={() => setIsAddressModalOpen(true)}>
                        <label>주소 검색</label>
                        <button className='hidden'>주소 검색</button>
                    </div>
                </div>
                <div className='field'>
                    <label className="hidden">ADDRESS</label>
                    <input type="text" value={address} readOnly placeholder="주소" />

                </div>
                <div className='field'>
                    <label className="hidden">INTRO</label>
                    <input type="text" placeholder="한마디" value={intro} onChange={(e)=>{setIntro(e.currentTarget.value)}}/>
                </div>
                <div className='field'>
                    <label className="hidden">PROFILE IMG</label>
                    <input type="file" accept=".jpg,.jpeg,.png,.gif" onChange={(e)=>{fileUpload(e)}}/>
                </div>
                <div className='field'>
                    <label className="hidden">Profile img preview</label>
                    <div><img src={imgSrc} style={imgStyle} /></div>
                </div>
                <AddressModal
                    isOpen={isAddressModalOpen}
                    onClose={() => setIsAddressModalOpen(false)}
                    onComplete={handleComplete}
                />
            </div>

            <div className='login-btns'>
                <div className="login-btn" onClick={ ()=>{   onSubmit()    }  }><IoCreateOutline />JOIN</div>
            </div>
        </div>




        </>)}

        </div>

    )
}

export default Savekakaoinfo
