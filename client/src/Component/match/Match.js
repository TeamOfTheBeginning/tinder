import React, {useState, useEffect, useSelector , useMemo, useRef} from 'react'
import MatchingMember from './MatchingMember'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Match = () => {

  // const lUser = useSelector( state=>state.user );
  const [oppositeGender, setOppositeGender] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    let gender = 1;
    axios.get(`/api/member2/getOppositeGender`, { params: { gender } })
        .then((result) => {
            console.log("result.data.oppositeGender: " + JSON.stringify(result.data.oppositeGender));
            setOppositeGender(result.data.oppositeGender);
        })
        .catch((err) => { console.error(err); });
  }, []);


  async function rematch(){

    let gender = 1;

    await axios.get(`/api/member2/getOppositeGender`,{params:{gender}})
    .then((result)=>{
        console.log("result.data.oppositeGender"+JSON.stringify(result.data.oppositeGender))
        setOppositeGender(result.data.oppositeGender)
    }
    ).catch((err)=>{console.error(err)}) 
  }
  
  async function like(){

    let memberId = 1;

    await axios.post(`/api/member2/insertLike`,{liker:memberId , liked:oppositeGender.memberId })
    .then((result)=>{
        console.log("result.data.msg"+result.data.msg)

        if(result.data.msg=='yes') {alert("좋아요가 완료되었습니다!")}
        else if(result.data.msg=='no') {alert("좋아요가 취소되었습니다!")}
        else {alert("시스템 오류!")}
    }
    ).catch((err)=>{console.error(err)})

    // let gender = 1;

    // await axios.get(`/api/member2/getOppositeGender`,{params:{gender}})
    // .then((result)=>{
    //     console.log("result.data.oppositeGender"+JSON.stringify(result.data.oppositeGender))
    //     setOppositeGender(result.data.oppositeGender)
    // }
    // ).catch((err)=>{console.error(err)})
  }
  

/*

{"oppositeGender":{"memberId":9,"nickname":"윈윈","email":"winwin@nct.com","pwd":"a","phone":"010-8888-8888","gender":0,"age":26,"profileImg":"윈윈.jpg","profileMsg":"WayV","snsId":null,"provider":null,"zipnum":"89012","address":"Wenzhou","memberRoleList":[]}}

*/

  return (
    <div className='matchContainer'>
      <MatchingMember oppositeGender={oppositeGender}/>
      <div className='matchContainerBtns'>
      <button onClick={()=>rematch()}>재매칭</button>
      <button onClick={()=>like()}>좋아요</button>
      <button onClick={()=>navigate('/main')}>돌아가기</button>
      </div>
    </div>
  )
}

export default Match
