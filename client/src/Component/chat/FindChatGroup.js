import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import ChatGroup from './ChatGroup';

import '../../style/message/findchatgroup.css';

import jaxios from '../../util/jwtUtil';

const FindChatGroup = ({openSubMenu}) => {

    const navigate = useNavigate();
    const loginUser = useSelector(state=>state.user);

    const [chatGroupList, serChatGroupList] = useState();

    useEffect(() => {
      // console.log(loginUser)
      jaxios.get(`/api/chat/findChatGroup`, { params: { memberId:loginUser.memberId } })
          .then((result) => {
              // console.log("result.data.chatGroupList: " + JSON.stringify(result.data.chatGroupList));
              serChatGroupList(result.data.chatGroupList);

          })
          .catch((err) => { console.error(err); });
  }, []);


  


  return (
    <div className='findChatGroupContainer'>
      {/* <div className='findChatGroupBtns'>
        <button>쪽지보내기</button>
      </div> */}
      {
        (chatGroupList)?(
          chatGroupList.map((chatGroup, idx)=>{
            return (
              <div key={idx} className='findChatGroupListContainer'>
                <ChatGroup chatGroup={chatGroup} openSubMenu={openSubMenu}/>            
              </div>
            )
          })
        ):("Loading...")
      }
            
      {/* <button onClick={()=>navigate(-1)}>돌아가기</button> */}

    </div>
  )
}

export default FindChatGroup
