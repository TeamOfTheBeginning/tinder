import React, {useState, useEffect, useSelector , useMemo, useRef} from 'react'
import Member from './MatchingMember'
import axios from 'axios';

const Match = () => {

  // const lUser = useSelector( state=>state.user );
  const [oppositeGender, setOppositeGender] = useState();

  async function rematch(){

    let gender = 1;

    await axios.get(`/api/member2/getOppositeGender`,{params:{gender}})
    .then((result)=>{
        console.log("result.data"+result.data)
        setOppositeGender(result.data.oppositeGender)
    }
    ).catch((err)=>{console.error(err)}) }
  
  



  return (
    <div>      
      <button onClick={()=>rematch()}>rematch</button>
      <Member/>
    </div>
  )
}

export default Match
