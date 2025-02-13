import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

import '../../style/chatroomfrommatch.css';

const ChatRoomFromMatch = () => {
    const { memberId } = useParams();
    console.log("memberId"+memberId);
    const loginUser = useSelector(state=>state.user);
    console.log("loginUser.memberId"+loginUser.memberId);
    const navigate = useNavigate();

    const [chatList, setChatList] = useState();
    const [message, setMessage] = useState();
    const [chatGroupId, setChatGroupId] = useState();
    
    const handleInputChange = (e) => {
        setMessage(e.target.value); // 사용자 입력을 상태에 저장
    };

    useEffect(() => {    
        axios.get(`/api/chat/getChatList2`, { params: { myMemberId:loginUser.memberId,matchedMemberId:memberId } })
        .then((result) => {
            console.log("chatList"+JSON.stringify(result.data.chatList))
            setChatList(result.data.chatList);
            setChatGroupId(result.data.chatGroupId);
            console.log("chatList"+JSON.stringify(chatList))
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

    async function sendMessage() {

        axios.post(`/api/chat/sendMessage`, null ,{ params: { content:message,chatGroupId,sender:loginUser.memberId } })
        .then((result) => {
            
            setChatList(result.data.chatList);
        })
        .catch((err) => { console.error(err); });
        
    }



  return (
    <div className='chatRoomFromMatchContainer'>
        <div className='chatRoomFromMatchContents'>
        {
            (chatList)?(
                chatList.map((chat, idx)=>{

                    const isOwnMessage = String(chat.sender.memberId) === String(loginUser.memberId);
                    console.log("chat.sender.memberId"+chat.sender.memberId+"loginUser.memberId"+loginUser.memberId)
                    console.log("isOwnMessage"+isOwnMessage)

                    return (
                        <div key={idx} className={`chat ${isOwnMessage ? 'myChat' : ''}`}>
                            <div className='chatContainer'>
                                <div className='chatImg'>
                                    <img src={`${process.env.REACT_APP_ADDRESS2}/userImg/${chat.sender.profileImg}`}/>&nbsp;
                                </div>
                                <div className='chatContent'>
                                    {chat.sender.nickname}&nbsp; {formatDate(chat.createdat)}&nbsp;<br/>{chat.content} &nbsp; 
                                </div>
                            </div>
                        </div>
                    )
                })
            ):("Loading...")
        }
        </div>

        <div className='chatRoomInput'>
            <input type='text' 
                placeholder='텍스트를 입력하세요'
                onChange={handleInputChange}
                value={message}
            /> <button onClick={()=>sendMessage()}>보내기</button>
        </div>
        

      
    </div>
  )
}

export default ChatRoomFromMatch
