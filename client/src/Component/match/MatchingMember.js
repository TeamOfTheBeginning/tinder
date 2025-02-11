import React, {useState, useEffect, useMemo, useRef} from 'react'
import axios from 'axios';

import '../../style/matchingmember.css';


const MatchingMember = (props) => {

  if (!props.oppositeGender) return <p>Loading...</p>;
    
  return (
    <div className='matchingMemberContainer'>


      <div className='matchingMemberTitle'>
        &nbsp;&nbsp;{props.oppositeGender.nickname} ({props.oppositeGender.age})
      </div>
      
      <div className='matchingMemberImg'>
        <div className='matchingMemberImgImg'>
          <img src={`${process.env.REACT_APP_ADDRESS2}/userImg/${props.oppositeGender.profileImg}`} />
        </div>
      </div>

      <div className='matchingMemberMsg'>
        &nbsp;&nbsp;{props.oppositeGender.profileMsg}
      </div>
      
      
    </div>
  )
}

export default MatchingMember
