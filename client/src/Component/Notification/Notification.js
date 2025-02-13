import React, {useState, useEffect} from 'react'
import { IoIosNotifications } from "react-icons/io";
import { useSelector } from 'react-redux';
import axios from 'axios';

import '../../style/notification.css';

const Notification = (props) => {

  const loginUser = useSelector(state=>state.user);
  const [isOpen, setIsOpen] = useState(false);

  const memberId = loginUser.memberId;
  // console.log("memberId"+memberId);

  // const [notificationList,setNotificationList] = useState();

  // const eventSource = new EventSource(`/api/sse/subscribe/${memberId}`);
  // console.log("구독완료!")

  // eventSource.addEventListener("notification", function (event) {
  //   const data = JSON.parse(event.data); // 문자열을 JSON 객체로 변환
  //   console.log("📢 새로운 알림:", data.notification.message); // message만 출력
  //   alert(data.notification.message);

  // });
  
  // eventSource.onerror = function () {
  //     console.log("SSE 연결 종료됨");
  // };

  useEffect(() => {
    // EventSource 연결 및 재연결 처리
    let eventSource;

    const createEventSource = () => {
      eventSource = new EventSource(`/api/sse/subscribe/${memberId}`);

      eventSource.onopen = () => {
        console.log("SSE 연결됨");
      };

      eventSource.addEventListener("notification", (event) => {
        console.log("SSE 구독됨");
        const data = JSON.parse(event.data);
        // console.log("📢 새로운 알림:", data.notification.message);        

        axios.get(`/api/notification/getNotificationTop4`, { params: { memberId:loginUser.memberId } })
        .then((result)=>{
          console.log("getNotificationTop4"+result.data.notificationList)
          props.setNotificationList(result.data.notificationList)
        }
        ).catch((err)=>{console.error(err)})

        setTimeout(() => alert(data.notification.message), 2000);        

      });

      eventSource.onerror = () => {
        console.log("SSE 연결 종료됨, 10초 후 재연결 시도");
        eventSource.close();  // 연결 종료
        setTimeout(createEventSource, 10000);  // 10초 후 재연결 시도
      };
    };

    // 최초 연결
    createEventSource();

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      if (eventSource) {
        eventSource.close();
        console.log("SSE 연결 종료됨 (언마운트)");
      }
    };
  }, []);



  async function getNotification(){
    

    console.log("getNotification")

    axios.get(`/api/notification/getNotificationTop4`, { params: { memberId:loginUser.memberId } })
    .then((result)=>{
      console.log("getNotificationTop4"+result.data.notificationList)
      props.setNotificationList(result.data.notificationList)
    }
    ).catch((err)=>{console.error(err)}) 

    setIsOpen(!isOpen);

  }

  async function updateNotificationRead(notificationId){
    console.log("updateNotificationRead")
    axios.post(`/api/notification/updateNotificationRead`, null ,{ params: { notificationId , memberId:loginUser.memberId } })
    .then((result)=>{
      console.log("updateNotificationRead"+result.data.notificationList)
      props.setNotificationList(result.data.notificationList)
      
    }
    ).catch((err)=>{console.error(err)})

  }
  



  return (
    <div className='notificationContainer'>
      <IoIosNotifications
        id='IoIosNotifications'
        onClick={getNotification}
        style={{ color: props.notificationList && props.notificationList.length > 0 ? 'red' : 'black' }}
      />



      {isOpen && ( // isOpen이 true일 때만 렌더링
        <div className="notificationList">
          {/* {notificationList.length} */}
          
          {props.notificationList && props.notificationList.length > 0 ? (
            props.notificationList.map((notification, idx) => (
              <div key={idx}>
                {notification.notificationId} - {notification.message}
                <button onClick={() => updateNotificationRead(notification.notificationId)}>
                {notification.notificationId}읽음
                </button>
              </div>
            ))
          ) :
          (
            <p>알림이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Notification
