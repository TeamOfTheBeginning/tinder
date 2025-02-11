import React, {useState, useEffect} from 'react'
import { IoIosNotifications } from "react-icons/io";
import { useSelector } from 'react-redux';

import '../../style/notification.css';

const Notification = () => {

  const loginUser = useSelector(state=>state.user);
  const memberId = loginUser.memberId;
  console.log("memberId"+memberId);

  const eventSource = new EventSource(`/api/sse/subscribe/${memberId}`);
  console.log("구독완료!")

  eventSource.addEventListener("notification", function (event) {
      // console.log("📢 새로운 알림:", event.data);
      alert("📢 새로운 알림:", event.data);
  });
  
  eventSource.onerror = function () {
      console.log("SSE 연결 종료됨");
  };
  



  return (
    <div className='notificationContainer'>
      <IoIosNotifications id='IoIosNotifications' />
    </div>
  )
}

export default Notification
