import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { loginAction, setFollower, setFollowed } from '../../store/userSlice';
import {Cookies, useCookies } from 'react-cookie'
import { useLocation } from 'react-router-dom';

import jaxios from '../../util/jwtUtil';
import { setCookie1, getCookie1 } from '../../util/cookieUtil2';

const Savekakaoinfo = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
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
        console.log("이미 객체")
        // 이미 객체라면 바로 사용
        claimsObj = cookies.claims;
      }
      setClaims(claimsObj);  // 상태에 claims 저장

    setCookie1('user', JSON.stringify(claimsObj), 1);
    dispatch(loginAction(claimsObj));

    let accessToken = claimsObj.accessToken;
    let refreshToken = claimsObj.refreshToken;

    jaxios.post('/api/member/update', {
        memberId: claimsObj.memberId, email:claimsObj.email,pwd:"a", age:"34",birthDate:"1990-07-16", gender:"0", profileMsg: "카카오로그인자"
    }).then((result) => {

    }).catch((err) => { console.error(err) });

    jaxios.get(`/api/member/getLoginUser`, { params: { memberId:claimsObj.memberId } })
    .then((result) => {

    // let accessToken=loginUser.accessToken
    // let refreshToken=loginUser.refreshToken
    
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

    // setIsLoginSuccess(true);

    // 2초 후에 /main으로 이동
    setTimeout(() => {
        navigate('/main');
    }, 2000);
  


    }).catch((err) => { console.error(err) });

    // res.data.loginUser.accessToken = accessToken;
    // res.data.loginUser.refreshToken = refreshToken;

    // setCookie1('user', JSON.stringify(res.data.loginUser), 1);
    // dispatch(loginAction(res.data.loginUser));

    
      
    } else {
      console.log("쿠키에 claims 데이터가 없습니다.");
    }
  }, []);  // 쿠키가 변경될 때마다 effect 실행
  


    // useEffect(
    //     ()=>{

    //         const urlParams = new URLSearchParams(window.location.search);
    //         const data1 = urlParams.get('data1');
    //         const data2 = urlParams.get('data2'); // 'data'라는 파라미터 값 가져오기

    //         console.log('Received data:', data1, data2);


    //         const fetchData = async () => {
                
        
    //             // console.log('Received data:', data1, data2); // 받은 데이터들 출력
        
    //             try {
    //                 // 로그인 요청
    //                 const result = await axios.post('/api/member/loginlocal', null, { params: { username: data1, password: data2 } });
        
    //                 if (result.data.error === 'ERROR_LOGIN') {
    //                     // setPwd('');
    //                     return alert('이메일과 패스워드를 확인하세요');
    //                 } else {
    //                     setCookie1('user', JSON.stringify(result.data), 1);
    //                     dispatch(loginAction(result.data));
        
    //                     let accessToken = result.data.accessToken;
    //                     let refreshToken = result.data.refreshToken;
        
    //                     const res = await jaxios.get('/api/member/getLoginUser', { params: { memberId: result.data.memberId } });
        
    //                     res.data.loginUser.accessToken = accessToken;
    //                     res.data.loginUser.refreshToken = refreshToken;
        
    //                     setCookie1('user', JSON.stringify(res.data.loginUser), 1);
    //                     dispatch(loginAction(res.data.loginUser));
        
    //                     const lUser = res.data.loginUser;
    //                     lUser['follower'] = res.data.follower;
    //                     lUser['followed'] = res.data.followed;
        
    //                     // dispatch(setFollower(res.data.follower));
    //                     // dispatch(setFollowed(res.data.followed));
        
    //                     cookies.set('follower', JSON.stringify(res.data.follower), { path: '/' });
    //                     cookies.set('followed', JSON.stringify(res.data.followed), { path: '/' });
        
    //                     // handleJoin(result.data.memberId);
    //                     // localStorage.setItem('nickname', result.data.nickname);
        
    //                     // setIsLoginSuccess(true);
        
    //                     // 2초 후에 /main으로 이동
    //                     setTimeout(() => {
    //                         navigate('/main');
    //                     }, 2000);
    //                 }
    //             } catch (err) {
    //                 console.error(err);
    //             }
    //         };
        
    //         // 비동기 함수 호출
    //         fetchData();
    //     }, []
    // )
    return (
        <div>
        
        </div>
    )
}

export default Savekakaoinfo
