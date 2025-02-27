import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Modal from './FollowModal';
import * as PortOne from "@portone/browser-sdk/v2";

import { useDispatch } from 'react-redux';
import { loginAction, setFollower, setFollowed } from '../../store/userSlice';
import {Cookies} from 'react-cookie'
import { setCookie1, getCookie1 } from '../../util/cookieUtil2';

import jaxios from '../../util/jwtUtil';
import '../../style/mypage.css'


const MyPage = ({openSubMenu}) => {

    const loginUser = useSelector( state=>state.user );
    const [profileImg, setProfileImg] = useState('');
    const [ imgSrc, setImgSrc ]=useState('');
    const navigate = useNavigate();
    const [word, setWord] = useState('n');
    const [imgList, setImgList] = useState([]);
    const [isFollowerModalOpen, setIsFollowerModalOpen] = useState(false);
    const [isFollowedModalOpen, setIsFollowedModalOpen] = useState(false);

    // console.log(loginUser.memberRoleList)

    const dispatch = useDispatch()
    const cookies = new Cookies()

    const toggleFollowerModal = () => {
        setIsFollowerModalOpen(!isFollowerModalOpen);
    };
    
    const toggleFollowedModal = () => {
    setIsFollowedModalOpen(!isFollowedModalOpen);
    };
    
    useEffect(() => {
        if (loginUser.profileImg) {
            setImgSrc(`http://localhost:8070/userimg/${loginUser.profileImg}`);
        }
        else{
            
        }
    }, [loginUser]);

    function ei(ei){
    if(ei==0){return "E"}
    else{return "I"};
    }

    function ns(ns){
    if(ns==0){return "N"}
    else{return "S"};
    }

    function tf(tf){
    if(tf==0){return "T"}
    else{return "F"};
    }

    function jp(jp){
    if(jp==0){return "J"}
    else{return "P"};
    }


    const requestPayment = async () => {
    try {
        const response = await PortOne.requestPayment({
            storeId: "store-0ef99292-e8d5-4956-a265-e1ec0ee73634", // 고객사 storeId로 변경해주세요.
            channelKey: "channel-key-32253616-9557-4cb7-ab9c-ecc20d5e5de5", // 콘솔 결제 연동 화면에서 채널 연동 시 생성된 채널 키를 입력해주세요.
            paymentId: `payment${Date.now()}`,
            orderName: "틴더 결제",
            totalAmount: 1,
            currency: "CURRENCY_KRW",
            payMethod: "CARD",
            customer: {
                fullName: loginUser.nickname,
                phoneNumber: loginUser.phone,
                email: loginUser.email,
            },
            bypass: {
                inicis_v2: {
                logo_url: "https://portone.io/assets/portone.87061e94.avif",
                logo_2nd: "https://admin.portone.io/assets/img/auth/lock.png",
                parentemail: "parentemail",
                Ini_SSGPAY_MDN: "01012341234",
                acceptmethod: ["SKIN(#F7186A)", "below1000", "ocb"],
                P_CARD_OPTION: "selcode=14",
                P_NMANE: "포트원",
                P_RESERVED: ["below1000=Y", "noeasypay=Y"]
                }
            }
        });

        if (response.code !== undefined) {
            // 오류 발생
            return alert(response.message);
        }
        const result = await jaxios.post('/api/payment/order',null,{params:{
            memberId:loginUser.memberId, productId:1}
        })
        // console.log("result1"+result)
        // console.log("result2"+result.data)
        // console.log("result3"+result.orderingId)

        
          // /payment/complete 엔드포인트를 구현해야 합니다. 다음 목차에서 설명합니다.
        const notified = await jaxios.post('/api/payment/complete', {
            paymentId: response.paymentId,
            memberId: loginUser.memberId,
            orderingId:result.data,
        }, {
            headers: { "Content-Type": "application/json" }
        });

        alert("결제완료")

        jaxios.get(`/api/member/getLoginUser`, { params: { memberId:loginUser.memberId } })
            .then((result) => {

            let accessToken=loginUser.accessToken
            let refreshToken=loginUser.refreshToken
            
            result.data.loginUser.accessToken = accessToken;
            result.data.loginUser.refreshToken = refreshToken;
            

            setCookie1('user', JSON.stringify(result.data.loginUser) , 1)
            dispatch( loginAction( result.data.loginUser ) )



            }).catch((err) => { console.error(err) });

    } catch (error) {
        console.error('본인 인증 오류:', error);
    } finally { }
}

// ✅ 특정 역할이 있는지 체크하는 함수
const hasRequiredRoles = (roles) => {
    return roles.includes("USER") && roles.includes("Gold");
};

const buyItems = async () => {

    
    if(window.confirm("Gold 회원권을 구매하시겠습니까?")) {

        if(loginUser.account<=0){
            alert("잔고를 확인해주세요!")
            return
        }

        // if(){

        // }

    jaxios.post(`/api/member2/setMemberRoleGold`, null ,{ params: { memberId:loginUser.memberId } })
    .then((result) => {
        
        if(result.data.msg="yes"){
            
            alert("Gold 회원권 구매에 성공하셨습니다.");

            jaxios.get(`/api/member/getLoginUser`, { params: { memberId:loginUser.memberId } })
            .then((result) => {

            let accessToken=loginUser.accessToken
            let refreshToken=loginUser.refreshToken
            
            result.data.loginUser.accessToken = accessToken;
            result.data.loginUser.refreshToken = refreshToken;
            

            setCookie1('user', JSON.stringify(result.data.loginUser) , 1)
            dispatch( loginAction( result.data.loginUser ) )



            }).catch((err) => { console.error(err) });        

            
        }else if(result.data.msg="money"){
            alert("잔고를 다시 확인해주세요.");
        }


    }).catch((err) => { console.error(err) });

    }else{
    alert("Gold 회원권 구매를 취소 하셨습니다.");
}
    
}

    return (
        <div className='SideContainer'>
            <div className='mypage'>
                <div className='profileImage'>
                    <div className='img'>
                        <img src={imgSrc} />
                    </div>
                    <div className='imgBg'></div>
                </div>

                <div className='userinfo'>
                    <div className='profile'>
                        <div className='field'>
                            <label>E-mail</label>
                            <div>{loginUser.email}</div>
                        </div>
                        <div className='field'>
                            <label>Nick Name</label>
                            <div>{loginUser.nickname}</div>
                        </div>
                        <div className='field'>
                            <label onClick={toggleFollowerModal} style={{cursor:'pointer'}}>Follower</label>
                            <div>
                                {
                                    (loginUser.followed)?(loginUser.followed.length):(0)
                                }
                            </div>
                        </div>
                        <div className='field'>
                            <label onClick={toggleFollowedModal} style={{cursor:'pointer'}} >Followed</label>
                            <div>
                                {
                                    (loginUser.follower)?(loginUser.follower.length):(0)
                                }
                            </div>
                        </div>
                        <div className='field'>
                            <label>intro</label>
                            <div>{loginUser.profileMsg}</div>
                        </div>
                        <div className='field'>
                            <label>충전금액</label>
                            <div>{loginUser.account}</div>
                        </div>
                        <div className='field'>
                            <label>온도</label>
                            <div>{loginUser.temp}</div>
                        </div>
                        <div className='field'>
                            <label>맴버롤</label>
                            <div>{loginUser.memberRoleList}</div>
                        </div>
                        <div className='field'>
                            <label>MBTI</label>
                            <div>
                                {ei(loginUser.memberInfo.ei)}
                                {ns(loginUser.memberInfo.ns)}
                                {tf(loginUser.memberInfo.tf)}
                                {jp(loginUser.memberInfo.jp)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='btns' >
                    <div id ="btn" onClick={()=> openSubMenu('editProfile')}><button>정보수정</button></div>
                    
                    <div id ="btn" onClick={()=> openSubMenu('editOpponent')}><button>상대정보</button></div>
                    
                    <div id ="btn" onClick={()=>{requestPayment()}}><button>충전</button></div>
                    
                    <div id ="btn">
                
                    <div id ="btn">
                        <button 
                            
                            onClick={() => {
                                if (loginUser && hasRequiredRoles(loginUser.memberRoleList)) {
                                    // props.onSubMenuSelect('findLiker');
                                    alert("이미 골드회원이십니다.")
                                } else {
                                    buyItems();
                                }
                            }}
                        >
                            골드회원
                        </button>
                    </div>
                

                
                </div>
                
                </div>

                <Modal isOpen={isFollowerModalOpen} onClose={toggleFollowerModal}>
                <h2>나를 팔로우한 사용자</h2>
                <ul>
                    {loginUser.followed && loginUser.followed.map((followed, index) => (
                    <li key={index}> {/* key는 index가 아닌 고유한 값을 사용하는 것이 좋습니다 (예: followed.followId) */}
                        팔로워 nickname: {followed.follower.nickname}, profile: <img src={`http://localhost:8070/userimg/${followed.follower.profileImg}`} style={{width : '70px', height:'70px'}} /> 
                        
                    </li>
                    ))}
                </ul>
                </Modal>

                <Modal isOpen={isFollowedModalOpen} onClose={toggleFollowedModal}>
                <h2>내가 팔로우한 사용자</h2>
                <ul>
                    {loginUser.follower && loginUser.follower.map((follower, index) => (
                    <li key={index}>
                        팔로우 nickname: {follower.followed.nickname}, profile: <img src={`http://localhost:8070/userimg/${follower.followed.profileImg}`} style={{width : '70px', height:'70px'}} />
                    </li>
                    ))}
                </ul>
                </Modal>

                {/* <div className='userpost' >
                    {
                        (imgList)?(
                            imgList.map((imgs, idx)=>{
                                return (
                                    <div key={idx}>
                                        <img src={`http://localhost:8070/images/${imgs}`} />
                                    </div>
                                )
                            })
                        ):(<div>Loading...</div>)
                    }
                </div> */}
            </div>
        </div>
    )
}

export default MyPage
