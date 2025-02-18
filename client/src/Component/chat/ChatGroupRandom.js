import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import '../../style/message/chatgrouprandom.css';

const ChatGroupRandom = (props) => {

    const [chatMemberList, setChatMemberList] = useState();
    const navigate = useNavigate();
    const loginUser = useSelector(state=>state.user);

    function enterChatRoomFromChatGroupRandom(chatGroupId){
        console.log(chatGroupId);
        navigate(`/chatRoomFromRandom/${chatGroupId}`);
    }

    // useEffect(() => {
    //     // console.log(loginUser)
    //     axios.get(`/api/chat/findChatGroupMember`, { params: { chatGroupId:props.chatGroup.chatGroupId } })
    //         .then((result) => {
    //             console.log("result.data.oppositeGender: " + JSON.stringify(result.data.chatMemberList));
    //             setChatMemberList(result.data.chatMemberList);
    //         })
    //         .catch((err) => { console.error(err); });
    // }, []);

  return (
    <div className='chatGroupRandomContainer'>
        <div className='chatGroupRandomProfile'>
            
        {props.chatGroup.chatGroupName}
        ({props.chatGroup.memberCount}인)<br/>

        </div>
        <div className='chatGroupRandomMember'>
        {/* {
            (chatMemberList)?(
                chatMemberList.map((chatMember, idx)=>{
                    return (
                        <div key={idx}>
                            {chatMember.nickname}&nbsp;
                        </div>
                    )
                })
            ):("Loading...")
        } */}
        </div>

        <div className='chatGroupRandomBtns'>
            <button onClick={()=>enterChatRoomFromChatGroupRandom(props.chatGroup.chatGroupId)}>입장</button>
        </div>
    </div>
  )
}

export default ChatGroupRandom
