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
