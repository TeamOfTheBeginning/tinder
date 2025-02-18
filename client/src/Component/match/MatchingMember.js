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


  if (!props.oppositeGender) return <p>Loading...</p>;
    
  return (
    <div className='matchingMemberContainer'>


      <div className='matchingMemberTitle'>
        &nbsp;&nbsp;{props.oppositeGender.nickname} ({props.oppositeGender.age})
      </div>
      
      <div className='matchingMemberImg'>
        <div className='matchingMemberImgImg'>
          <img src={`${process.env.REACT_APP_ADDRESS2}/userimg/${props.oppositeGender.profileImg}`} />
        </div>
      </div>

      <div className='matchingMemberMsg'>
        &nbsp;&nbsp;{props.oppositeGender.profileMsg}
      </div>

      <div className='matchingMemberBtns'>
        <button className='matchBtn' onClick={()=>like()}>좋아요</button>
      </div>
      
      
    </div>
  )
}

export default MatchingMember
