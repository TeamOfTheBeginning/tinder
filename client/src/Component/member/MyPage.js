import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import SideBar from '../SideBar';
import { useSelector } from 'react-redux';
import Modal from './FollowModal';
import * as PortOne from "@portone/browser-sdk/v2";

import { useDispatch } from 'react-redux';
import { loginAction, setFollower, setFollowed } from '../../store/userSlice';
import {Cookies} from 'react-cookie'


const MyPage = () => {

    const loginUser = useSelector( state=>state.user );
    const [profileImg, setProfileImg] = useState('');
    const [ imgSrc, setImgSrc ]=useState('');
    const navigate = useNavigate();
    const [word, setWord] = useState('n');
    const [imgList, setImgList] = useState([]);
    const [isFollowerModalOpen, setIsFollowerModalOpen] = useState(false);
    const [isFollowedModalOpen, setIsFollowedModalOpen] = useState(false);

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
        
          // /payment/complete 엔드포인트를 구현해야 합니다. 다음 목차에서 설명합니다.
        const notified = await fetch('/api/payment/complete', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // paymentId와 주문 정보를 서버에 전달합니다
            body: JSON.stringify({
                paymentId: response.paymentId,
                memberId: loginUser.memberId,
                // 주문 정보...
            }),
        });
        alert("결제완료")

        const res = await axios.get('/api/member/getLoginUser');
        const lUser = res.data.loginUser;
        cookies.set('user', JSON.stringify( lUser ) , {path:'/', })
        dispatch( loginAction( res.data.loginUser ) )

    } catch (error) {
        console.error('본인 인증 오류:', error);
    } finally { }
}

const buyItems = async () => {
    
}

    return (
        <div className='Container'>
            {/* <SideBar setWord={setWord}/> */}
            <div className='mypage'>
                <div className='img'>
                    <img src={imgSrc} />
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
                    <div id ="btn" onClick={()=>{ navigate('/editProfile')}}>Edit Profile</div>
                    <div id ="btn"onClick={()=>{ navigate('/nearMember', {state :{loginUser:loginUser}})}}>&nbsp;Post Write</div>
                    <div id ="btn" onClick={()=>{requestPayment()}}>&nbsp;<button>충전</button></div>
                    <div id ="btn" onClick={()=>{buyItems()}}>&nbsp;<button>결제</button></div>
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
