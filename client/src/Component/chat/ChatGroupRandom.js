import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import '../../style/message/chatgroup.css';

import jaxios from '../../util/jwtUtil';

const ChatGroupRandom = (props) => {

    const [chatMemberList, setChatMemberList] = useState();
    const navigate = useNavigate();
    const loginUser = useSelector(state=>state.user);

    function enterChatRoomFromChatGroupRandom(chatGroupId){
        console.log(chatGroupId);
        navigate(`/chatRoomFromRandom/${chatGroupId}`);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString); // ISO 8601 형식의 문자열을 Date 객체로 변환

        const day = String(date.getDate()).padStart(2, '0'); // 일 (2자리로 맞추기)
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1)
        const year = String(date.getFullYear()).slice(-2); // 년 (끝 두 자리만 사용)
        
        const hours = String(date.getHours()).padStart(2, '0'); // 시간
        const minutes = String(date.getMinutes()).padStart(2, '0'); // 분
        
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    const handleClick = () => {
        console.log("props.chatGroup.chatGroupId"+props.chatGroup.chatGroupId)

        props.subMenuDataRef.current = props.chatGroup.chatGroupId;
        // props.setSubMenuData(props.chatGroup.chatGroupId);
        props.openSubMenu('chatRoomFromRandom', props.chatGroup.chatGroupId);
    };

  return (
    <div className='chatGroupContainer'>
        <div className='chatGroupInfo'>
            <div className='chatGroupProfile'> 
                    <div className='chatroom-name'>
                        {props.chatGroup.chatGroupName}
                    ({props.chatGroup.memberCount}인)
                    </div>
                    <div className='chatroom-date'>
                    {formatDate(props.chatGroup.createdDate)}
                    </div>
                </div>        
            </div> 

            <div className='chatGroupBtns' onClick={handleClick}>
                <button className='chatGroupBtn'>입장</button>
            </div>
    </div>
  )
}

export default ChatGroupRandom
