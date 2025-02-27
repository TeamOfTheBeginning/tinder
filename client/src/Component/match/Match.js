import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import MatchingMember from './MatchingMember'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import '../../style/match/match.css';

import jaxios from '../../util/jwtUtil';

const Match = (props) => {

  const [oppositeGender, setOppositeGender] = useState();
  const navigate = useNavigate();

  const loginUser = useSelector(state=>state.user);
  // console.log(loginUser)

  useEffect(() => {
    // console.log(loginUser)
    jaxios.get(`/api/member2/getOppositeGender2`, { params: { memberId:loginUser.memberId } })
    .then((result) => {
        // console.log("result.data.oppositeGender: " + JSON.stringify(result.data.oppositeGender));
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

  // ✅ 특정 역할이 있는지 체크하는 함수
  const hasRequiredRoles = (roles) => {
    return roles.includes("USER") && roles.includes("Gold");
  };


  return (
    <div className='matchContainer'>
      <div className='matchBtns'>
        <button className='matchBtn' onClick={()=>rematch()}>재매칭</button>        
        <button 
            className='matchBtn' 
            onClick={() => {
                if (loginUser && hasRequiredRoles(loginUser.memberRoleList)) {
                    props.onSubMenuSelect('findLiker');
                } else {
                    alert("Gold 회원 전용입니다.");
                }
            }}
        >
            Liker 조회
        </button>

        <button className='matchBtn' onClick={()=> props.onSubMenuSelect('matchedMember')}>매칭조회</button>&nbsp;        
      </div>

      <div className='matchMemberContainer'>
        <MatchingMember oppositeGender={oppositeGender}/>
      </div>
    </div>
  )
}

export default Match
