import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import ChatGroup from './ChatGroup';

import '../../style/findchatgroup.css';

const FindChatGroup = () => {

    const navigate = useNavigate();
    const loginUser = useSelector(state=>state.user);

    const [chatGroupList, serChatGroupList] = useState();

    useEffect(() => {
      console.log(loginUser)
      axios.get(`/api/chat/findChatGroup`, { params: { memberId:loginUser.memberId } })
          .then((result) => {
              console.log("result.data.chatGroupList: " + JSON.stringify(result.data.chatGroupList));
              serChatGroupList(result.data.chatGroupList);

          })
          .catch((err) => { console.error(err); });
  }, []);


  


  return (
    <div className='findChatGroupContainer'>      
      {
        (chatGroupList)?(
          chatGroupList.map((chatGroup, idx)=>{
            return (
              <div key={idx} className='findChatGroupListContainer'>
                <ChatGroup chatGroup={chatGroup}/>            
              </div>
            )
          })
        ):(null)
      }
            
      <button onClick={()=>navigate(-1)}>돌아가기</button>

    </div>
  )
}

export default FindChatGroup
