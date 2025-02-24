import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import '../../style/message/chatgroup.css';

import jaxios from '../../util/jwtUtil';

const ChatGroup = (props) => {
    
    const [chatMemberList, setChatMemberList] = useState();
    const navigate = useNavigate();
    const loginUser = useSelector(state=>state.user);

    function enterChatRoomFromChatGroup(chatGroupId){
        console.log(chatGroupId);
        navigate(`/chatRoomFromChatGroup/${chatGroupId}`);
    }

    useEffect(() => {
        // console.log(loginUser)
        jaxios.get(`/api/chat/findChatGroupMember`, { params: { chatGroupId:props.chatGroup.chatGroupId } })
            .then((result) => {
                console.log("result.data.oppositeGender: " + JSON.stringify(result.data.chatMemberList));
                setChatMemberList(result.data.chatMemberList);
            })
            .catch((err) => { console.error(err); });
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString); // ISO 8601 형식의 문자열을 Date 객체로 변환

        const day = String(date.getDate()).padStart(2, '0'); // 일 (2자리로 맞추기)
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1)
        const year = String(date.getFullYear()).slice(-2); // 년 (끝 두 자리만 사용)
        
        const hours = String(date.getHours()).padStart(2, '0'); // 시간
        const minutes = String(date.getMinutes()).padStart(2, '0'); // 분
        
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }



return (
    <div className='chatGroupContainer'>
        <div className='chatGroupProfile'>
            
        {props.chatGroup.chatGroupName}
        ({props.chatGroup.memberCount}인)<br/>{formatDate(props.chatGroup.createdDate)}
        

        </div>
        <div className='chatGroupMember'>
        {
            (chatMemberList)?(
                chatMemberList.map((chatMember, idx)=>{
                    return (
                        <div key={idx}>
                            {chatMember.nickname}&nbsp;
                        </div>
                    )
                })
            ):("Loading...")
        }
        </div>

        <div className='chatGroupBtns'>
            <button onClick={()=>enterChatRoomFromChatGroup(props.chatGroup.chatGroupId)}>입장</button>
        </div>
    </div>
  )
}

export default ChatGroup
