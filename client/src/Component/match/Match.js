import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import MatchingMember from './MatchingMember'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import '../../style/match.css';

const Match = () => {

  const [oppositeGender, setOppositeGender] = useState();
  const navigate = useNavigate();

  const loginUser = useSelector(state=>state.user);
  console.log(loginUser)

  useEffect(() => {
    console.log(loginUser)
    axios.get(`/api/member2/getOppositeGender`, { params: { gender:loginUser.gender, age:loginUser.age } })
        .then((result) => {
            console.log("result.data.oppositeGender: " + JSON.stringify(result.data.oppositeGender));
            setOppositeGender(result.data.oppositeGender);
        })
        .catch((err) => { console.error(err); });
  }, []);


  async function rematch(){

    axios.get(`/api/member2/getOppositeGender`, { params: { gender:loginUser.gender, age:loginUser.age } })
    .then((result)=>{
        console.log("result.data.oppositeGender"+JSON.stringify(result.data.oppositeGender))
        setOppositeGender(result.data.oppositeGender)
    }
    ).catch((err)=>{console.error(err)}) 
  }
  
  async function like(){

    await axios.post(`/api/member2/insertMemberLike`,{liker:loginUser.memberId , liked:oppositeGender.memberId })
    .then((result)=>{
        console.log("result.data.msg"+result.data.msg)

        if(result.data.msg=='yes') {alert("좋아요가 완료되었습니다!")}
        else if(result.data.msg=='no') {alert("좋아요가 취소되었습니다!")}
        else {alert("시스템 오류!")}
    }
    ).catch((err)=>{console.error(err)})


    // axios.get(`/api/member2/getOppositeGender`, { params: { gender:loginUser.gender, age:loginUser.age } })
    // .then((result)=>{
    //     console.log("result.data.oppositeGender"+JSON.stringify(result.data.oppositeGender))
    //     setOppositeGender(result.data.oppositeGender)
    // }
    // ).catch((err)=>{console.error(err)}) 
  }

  return (
    <div className='matchContainer'>
      <div className='matchBtns'>
        <button className='matchBtn' onClick={()=>rematch()}>재매칭</button>
        <button className='matchBtn' onClick={()=>like()}>좋아요</button>
        <button className='matchBtn' onClick={()=>navigate('/findLiker')}>Liker조회</button>
        <button className='matchBtn' onClick={()=>navigate('/matchedMember')}>매칭조회</button>
        <button className='matchBtn' onClick={()=>navigate('/main')}>돌아가기</button>
      </div>


      <MatchingMember oppositeGender={oppositeGender}/>
      
    </div>
  )
}

export default Match
