import React from 'react'

import '../../style/post/adcomponent.css';

const AdComponent = () => {
  return (
    <div className='adComponentContainer'>
      {/* 광고페이지 입니다.<br/> */}
      <img src={`${process.env.REACT_APP_ADDRESS2}/userimg/다이브.png`} />
    </div>
  )
}

export default AdComponent
