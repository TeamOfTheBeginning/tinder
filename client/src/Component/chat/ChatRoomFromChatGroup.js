import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

import LoadingSpinner from "../LoadingSpinner";
import '../../style/message/chatroomfromchatgroup.css';

import jaxios from '../../util/jwtUtil';
import useChatAutoScroll from "../../Hooks/useChatAutoScroll";

const ChatRoomFromChatGroup = (props) => {
    // console.log("props.chatGroupId"+props.chatGroupId)

    // const { chatGroupId } = props.chatGroupId;

    const chatGroupId=props.chatGroupId;

    // const { chatGroupId } = useParams();
    // console.log("chatGroupId"+chatGroupId);

    const navigate = useNavigate();
    const loginUser = useSelector(state=>state.user);

    const [chatList, setChatList] = useState();
    const [message, setMessage] = useState();
    const { messageEndRef, scrollToBottom } = useChatAutoScroll();

    const handleInputChange = (e) => {
        setMessage(e.target.value); // 사용자 입력을 상태에 저장
    };


    useEffect(() => {
        const fetchChatList = () => {
            jaxios.get(`/api/chat/getChatList1`, { params: { chatGroupId:props.chatGroupId } })
                .then((result) => {
                    if (JSON.stringify(chatList) !== JSON.stringify(result.data.chatList)) {
                        setChatList(result.data.chatList);
                    }
                })
                .catch((err) => { console.error(err); });
        };
    
        fetchChatList();
        const interval = setInterval(fetchChatList, 5000);
    
        return () => clearInterval(interval);
    }, [chatGroupId, chatList]);


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
        try {
            const response = await jaxios.post(`/api/chat/sendMessage`, null, {
                params: { content: message, chatGroupId, sender: loginUser.memberId }
            });

            if (!message.trim()) {
                alert("메시지를 입력하세요!");
                return;
            }
    
            if (response.data.expired) {
                alert("이 채팅방은 1시간이 지나 만료되었습니다. 메시지를 보낼 수 없습니다.");
                return;
            }
    
            if (response.data.blocked) {
                alert("메시지를 보낼 수 없습니다. 차단한 사용자 또는 차단된 사용자와의 대화입니다.");
                return;
            }
    
            setChatList(response.data.chatList);
            setMessage('');
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <div className='chatRoomFromChatGroupContainer'>
        <div className='chatRoomFromChatGroupContents'>
        {
            (chatList)?(
                chatList.map((chat, idx)=>{

                    const isOwnMessage = String(chat.sender.memberId) === String(loginUser.memberId);
                    // console.log("chat.sender.memberId"+chat.sender.memberId+"loginUser.memberId"+loginUser.memberId)
                    // console.log("isOwnMessage"+isOwnMessage)

                    return (
                        <div key={idx} className={`chat ${isOwnMessage ? 'myChat' : ''}`}>
                            <div className='chatContainer'>
                                {!isOwnMessage && (
                                    <div className='chat-userinfo'>
                                        <div className='chatImg'>
                                            <img src={`${process.env.REACT_APP_ADDRESS2}/userimg/${chat.sender?.profileImg || 'default.jpg'}`} alt="Profile" />
                                        </div>
                                        <span className='nickname'>{chat.sender?.nickname || '닉네임 없음'}</span>
                                    </div>
                                )}
                                <div className='chatContent'>{chat.content}</div>
                            </div>
                            <div className='chatDate'>{formatDate(chat.createdDate)}</div>
                        </div>
                    )
                    
                })
            ):(<LoadingSpinner />)
        }
        </div>

        <div className='chatRoomInput'>
            <div className='inputBox'>
                <input type='text' 
                placeholder='텍스트를 입력하세요'
                onChange={handleInputChange}
                value={message}
                onFocus={scrollToBottom}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={()=>sendMessage()}>보내기</button>
            </div>
        </div>
        

      
    </div>
  )
}

export default ChatRoomFromChatGroup
