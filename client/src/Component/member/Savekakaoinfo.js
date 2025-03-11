import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import DaumPostcode from 'react-daum-postcode';
import * as PortOne from "@portone/browser-sdk/v2";
import { IoCreateOutline } from "react-icons/io5";
import AddressModal from './AddressModal';

import '../../style/member/savekakaoinfo.css';
import '../../style/login.css';
import Loading from '../Loading';
import RealtimeConnectInfo from '../realtimeconnectinfo/RealtimeConnectInfo';

import { useSearchParams, useLocation , useParams } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { loginAction, setFollower, setFollowed } from '../../store/userSlice';
import {Cookies, useCookies } from 'react-cookie';

import jaxios from '../../util/jwtUtil';
import { setCookie1, getCookie1 } from '../../util/cookieUtil2';
import { LuActivity } from 'react-icons/lu';


//웹소켓 경로 관련
const isLocalhost = window.location.hostname === 'localhost' ;
// || window.location.hostname === '127.0.0.1';

const API_BASE_URL = isLocalhost
  ? 'http://localhost:8070' // 로컬 개발 환경
  : `http://${window.location.hostname}:8390`; // 클라이언트가 실행 중인 네트워크 기반으로 서버 IP 설정

const SOCKET_URL = `${API_BASE_URL}/ws_real_chat`;

const Savekakaoinfo = () => {

    const { kakaoEmail } = useParams();
    const decodedEmail = decodeURIComponent(kakaoEmail); // URL 디코딩

    alert("decodedEmail"+decodedEmail)

    const [userCount, setUserCount] = useState();
    const [client, setClient] = useState(null);
        
    
    useEffect(() => {
        console.log("WebSocket 연결시도")
        // WebSocket 클라이언트 설정
        const stompClient = new Client({
            brokerURL: `ws://${API_BASE_URL}/ws_real_chat`,  // 서버의 WebSocket 엔드포인트
            connectHeaders: {
            // 필요한 경우 인증 정보 추가
            },
            onConnect: () => {
            console.log('WebSocket connected');
            stompClient.activate();
            setClient(stompClient);
            console.log(stompClient)
            console.log(JSON.stringify(stompClient))            
            },
            onDisconnect: () => {
            console.log('WebSocket disconnected');
            },
            onStompError: (frame) => {
            console.error('STOMP error: ', frame);
            },
            webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws_real_chat`),
        });
    
        console.log(JSON.stringify(stompClient))
        stompClient.activate();
        setClient(stompClient);
    
        return () => {
            console.log(stompClient)
            if (stompClient) {
            stompClient.deactivate();  // 클린업: 컴포넌트가 언마운트될 때 WebSocket 연결 종료
            }
        };        
    }, []);
    
    const handleJoin = (memberId) => {
        client.publish({ destination: '/app/join', body: JSON.stringify({ memberId }) });
    };
    
    // const handleLeave = (memberId) => {
    //   client.publish({ destination: '/app/leave', body: JSON.stringify({ memberId }) });
    // };

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showModal, setShowModal] = useState(false);

    const [cookies, setCookie, removeCookie] = useCookies(['claims']);  // 쿠키 이름 배열로 전달
    const [claims, setClaims] = useState(null);

    useEffect(() => {
        const login = async () => {
            try {
                const result = await axios.post('/api/member/loginlocal', null, {
                    params: { username: decodedEmail, password: 'a' }
                });

                alert(result.data)
                alert(JSON.stringify(result.data))

                setCookie1('user', JSON.stringify(result.data), 1);
                dispatch(loginAction(result.data));

                let accessToken = result.data.accessToken;
                let refreshToken = result.data.refreshToken;

                const res = await jaxios.get('/api/member/getLoginUser', {
                    params: { memberId: result.data.memberId }
                });

                res.data.loginUser.accessToken = accessToken;
                res.data.loginUser.refreshToken = refreshToken;

                setCookie1('user', JSON.stringify(res.data.loginUser), 1);
                dispatch(loginAction(res.data.loginUser));

                const lUser = res.data.loginUser;
                lUser['follower'] = res.data.follower;
                lUser['followed'] = res.data.followed;

                dispatch(setFollower(res.data.follower));
                dispatch(setFollowed(res.data.followed));

                cookies.set('follower', JSON.stringify(res.data.follower), { path: '/' });
                cookies.set('followed', JSON.stringify(res.data.followed), { path: '/' });

                handleJoin(result.data.memberId);
                localStorage.setItem('nickname', result.data.nickname);

                // 로그인 성공 상태 활성화
                setIsLoginSuccess(true);

            } catch (error) {
                console.error("로그인 오류:", error);
            }
        };

        login();
    }, [kakaoEmail]);

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
        if(!adultVerification){ return alertAndScroll('성인인증을 해주세요', 'adultVerification');}
        if(email===''){ return alertAndScroll('이메일을 입력하세요', 'email');}
        if(nickname===''){ return alertAndScroll('닉네임을 입력하세요', 'nickname');}
        if(zipnum===''||address===''){ return alertAndScroll('주소 검색을 하세요', 'zipnum');}
        if (intro.length > 255) {
            alertAndScroll('자기소개는 255자 이하로 작성해주세요.', 'intro');
            return;
        }
        if(profileimg===''){ return alertAndScroll('프로필 이미지를 업로드 하세요', 'profileimg');}
        
        try{            
            let result = await axios.post('/api/member/nicknamecheck', null, {params:{nickname}} );
            if(result.data.msg === 'no' ){
                return alert('닉네임이 중복됩니다');
            }
            console.log({
                memberId: claims.memberId, email:claims.email, age:age, birthDate:birthDate, gender, nickname, phone, zipnum, address, profileMsg: intro, profileImg:profileimg, latitude:latitude, longitude:longitude, memberName:memberName,
            })
            result = await jaxios.post('/api/member/update', {
              memberId: claims.memberId, email:email, pwd:'a',age:age, birthDate:birthDate, gender, nickname, phone, zipnum, address, profileMsg: intro, profileImg:profileimg, latitude:latitude, longitude:longitude, memberName:memberName,
            });

            alert("가입완료.")      

            axios.get(`/api/member/getLoginUser`, { params: { memberId:claims.memberId } })
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

            
            handleJoin(result.data.loginUser.memberId);
            // alert(result.data.loginUser.memberId)
            localStorage.setItem('nickname', result.data.loginUser.nickname);   

            setIsLoginSuccess(true);

            }).catch((err) => { console.error(err) });  
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

    const handleLoadingComplete = () => {
        navigate('/main'); // 메인 페이지로 이동
        setLoadingComplete(true);
    };

    const [isLoginSuccess, setIsLoginSuccess] = useState(false);
    const [loadingComplete, setLoadingComplete] = useState(false);

    async function fileUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            const result = await axios.post('/api/member/fileupload', formData);
            setImgSrc(`${process.env.REACT_APP_ADDRESS}/userimg/${result.data.filename}`);
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
    <div className='kakao-container'>
        {isLoginSuccess?(!loadingComplete ? (
                            <Loading onComplete={handleLoadingComplete} />
                        ) : null)
        :
        (<>
            <div className='join-container' id='kakao-join'>
                <RealtimeConnectInfo />
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <p>로그인 중입니다...</p>
                        </div>
                    </div>
                )}
                <div className='login-btns'>
                    <div className="login-btn" id='adultVerification' onClick={ ()=>{   handleIdentityVerification()    }  }>성인인증</div>
                </div>
                <div className='joinform'>
                    <div className='field'>
                        <label className='hidden'>NAME</label>
                        <input type='text' placeholder='이름' id='name' value={memberName} onChange={(e)=>{setMemberName(e.currentTarget.value)}} readOnly/>
                    </div>

                    <div className='field flex-row'>
                        <div className='gender'>
                        <label className='hidden'>GENDER</label>
                            {/* 인증시 받아오는 경우 */}
                            <input type='text' placeholder='성별'
                            value={gender === "" || gender === null || gender === undefined ? "" : gender === 0 ? "남성" : "여성"}
                            readOnly
                        />
                        </div>

                        <div className='birth'>
                        <label className='hidden'>BIRTHDATE</label>
                            {/* 수정 불가능 하게 할 경우 */}
                            <input
                                type='text' // type을 date로 변경
                                placeholder='생년월일'
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
                        <input type='text' id='email' name='email' autoComplete='email' placeholder='E-MAIL (로그인 시 아이디로 사용됩니다.)' value={email} onChange={(e)=>{setEmail(e.currentTarget.value)}}/>
                    </div>
                    <div className='field'>
                        <label className="hidden">NICKNAME</label>
                        <input type="text" id='nickname' placeholder="닉네임" value={nickname} onChange={(e)=>{setNickname(e.currentTarget.value)}}/>
                    </div>
                    <div className='field flex-row'>
                        <div className='zipnum'>
                            <label className="hidden">ZIPNUM</label>
                            <input type="text" value={zipnum} readOnly placeholder="우편번호" />
                        </div>
                        <div className='login-btn' id='k-zipcode' onClick={() => setIsAddressModalOpen(true)}>
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
                        <input type="text" placeholder="한마디" id='intro' value={intro} onChange={handleIntroChange} />
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
                    <div className="login-btn" onClick={ ()=>{   onSubmit()    }  }><IoCreateOutline />JOIN</div>
                </div>
            </div>


        </>)}

    </div>

    )
}

export default Savekakaoinfo
