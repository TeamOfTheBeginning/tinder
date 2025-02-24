import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import MatchingMember from './MatchingMember'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import '../../style/match/match.css';

import jaxios from '../../util/jwtUtil';

const Match = ({openSubMenu}) => {

  const [oppositeGender, setOppositeGender] = useState();
  const navigate = useNavigate();

  const loginUser = useSelector(state=>state.user);
  console.log(loginUser)

  useEffect(() => {
    console.log(loginUser)
    jaxios.get(`/api/member2/getOppositeGender2`, { params: { memberId:loginUser.memberId } })
        .then((result) => {
            console.log("result.data.oppositeGender: " + JSON.stringify(result.data.oppositeGender));
            setOppositeGender(result.data.oppositeGender);
        })
        .catch((err) => { console.error(err); });
  }, []);


  async function rematch(){

    jaxios.get(`/api/member2/getOppositeGender2`, { params: { memberId:loginUser.memberId } })
    .then((result)=>{
        // console.log("result.data.oppositeGender"+JSON.stringify(result.data.oppositeGender))
        setOppositeGender(result.data.oppositeGender)
    }
    ).catch((err)=>{console.error(err)}) 
  }
  
  // async function like(){

  //   await jaxios.post(`/api/member2/insertMemberLike`,{liker:loginUser.memberId , liked:oppositeGender.memberId })
  //   .then((result)=>{
  //       console.log("result.data.msg"+result.data.msg)

  //       if(result.data.msg=='yes') {alert("좋아요가 완료되었습니다!")}
  //       else if(result.data.msg=='no') {alert("좋아요가 취소되었습니다!")}
  //       else {alert("시스템 오류!")}
  //   }
  //   ).catch((err)=>{console.error(err)})    
  // }

  return (
    <div className='matchContainer'>
      <div className='matchBtns'>
        <button className='matchBtn' onClick={()=>rematch()}>재매칭</button>        
        <button className='matchBtn' onClick={()=> openSubMenu('findLiker')}>Liker조회</button>&nbsp;
        <button className='matchBtn' onClick={()=> openSubMenu('matchedMember')}>매칭조회</button>&nbsp;        
      </div>

      <div className='matchMemberContainer'>
      <MatchingMember oppositeGender={oppositeGender}/>
      </div>
    </div>
  )
}

export default Match
