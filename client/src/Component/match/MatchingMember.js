import React, {useState, useEffect, useMemo, useRef} from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';

import '../../style/match/matchingmember.css';


const MatchingMember = (props) => {

  const loginUser = useSelector(state=>state.user);

  async function like(){

    await axios.post(`/api/member2/insertMemberLike`,{liker:loginUser.memberId , liked:props.oppositeGender.memberId })
    .then((result)=>{
        console.log("result.data.msg"+result.data.msg)

        if(result.data.msg=='yes') {alert("좋아요가 완료되었습니다!")}
        else if(result.data.msg=='no') {alert("좋아요가 취소되었습니다!")}
        else {alert("시스템 오류!")}
    }
    ).catch((err)=>{console.error(err)})    
  }

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

  function calculateMbtiMatchPercentage(){
    var percentage
    var ei;
    if(props.oppositeGender.memberInfo.ei == loginUser.opponentMemberInfo.ei){
      ei = 1
    }else{ei = 0}
    if(props.oppositeGender.memberInfo.ns == loginUser.opponentMemberInfo.ns){
      ns = 1
    }else{ns = 0}
    if(props.oppositeGender.memberInfo.tf == loginUser.opponentMemberInfo.tf){
      tf = 1
    }else{tf = 0}
    if(props.oppositeGender.memberInfo.jp == loginUser.opponentMemberInfo.jp){
      jp = 1
    }else{jp = 0}


    percentage = (ei+ns+tf+jp)/4
    
    return percentage;

  }

  const haversine = (lat1, lon1) => {
    var lat2 = loginUser.latitude
    var lon2 = loginUser.longitude


    const R = 6371; // 지구 반지름 (단위: km)
    
    // 위도 및 경도를 라디안으로 변환
    const toRadians = (degree) => (degree * Math.PI) / 180;
    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaPhi = toRadians(lat2 - lat1);
    const deltaLambda = toRadians(lon2 - lon1);

    // Haversine 공식 적용
    const a = Math.sin(deltaPhi / 2) ** 2 + 
              Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c).toFixed(1); // 거리 (단위: km)
};




  if (!props.oppositeGender) return <p>Loading...</p>;
    
  return (
    <div className='matchingMemberContainer'>      
      
      <div className='matchingMemberImg'>
        <div className='matchingMemberImgImg'>
          <img src={`${process.env.REACT_APP_ADDRESS2}/userimg/${props.oppositeGender.profileImg}`} />
        </div>
      </div>

      <div className='matchingMemberTitle'>
        &nbsp;&nbsp;{props.oppositeGender.nickname}({props.oppositeGender.age})

        &nbsp;&nbsp;{props.oppositeGender.address}

        &nbsp;&nbsp;&nbsp;
        {props.oppositeGender.temp}도

        &nbsp;&nbsp;{ei(props.oppositeGender.memberInfo.ei)}
        {ns(props.oppositeGender.memberInfo.ns)}
        {tf(props.oppositeGender.memberInfo.tf)}
        {jp(props.oppositeGender.memberInfo.jp)}
      </div>

      <div>
        <div>MBTI 매칭률 {calculateMbtiMatchPercentage()} </div>
        <div>취미 매칭률 </div>
        <div>거리 : {haversine(props.oppositeGender.latitude,props.oppositeGender.longitude)} km</div>

      </div>

      <div className='matchingMemberMsg'>
        &nbsp;&nbsp;{props.oppositeGender.profileMsg}
      </div>

      <div className='matchingMemberInfo'>
        
      </div>

      <div className='matchingMemberBtns'>
        <button className='matchBtn' onClick={()=>like()}>좋아요</button>
      </div>
      
      
    </div>
  )
}

export default MatchingMember
