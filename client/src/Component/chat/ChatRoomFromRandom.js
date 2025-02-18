import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

import '../../style/message/chatroomfromrandom.css';

const ChatRoomFromRandom = () => {

    const { chatGroupId } = useParams();
    
    const navigate = useNavigate();
    const loginUser = useSelector(state=>state.user);

    const [chatList, setChatList] = useState();
    const [message, setMessage] = useState();

    const handleInputChange = (e) => {
        setMessage(e.target.value); // 사용자 입력을 상태에 저장
    };

    useEffect(() => {
        // console.log(loginUser)
        axios.get(`/api/chat/getChatList1`, { params: { chatGroupId } })
            .then((result) => {
                setChatList(result.data.chatList);
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
            try {
                const response = await axios.post(`/api/chat/sendMessage`, null, {
                    params: { content: message, chatGroupId, sender: loginUser.memberId }
                });
        
                if (response.data.expired) {
                    alert("이 채팅방은 12시간이 지나 만료되었습니다. 메시지를 보낼 수 없습니다.");
                    return;
                }
        
                if (response.data.blocked) {
                    alert("메시지를 보낼 수 없습니다. 차단한 사용자 또는 차단된 사용자와의 대화입니다.");
                    return;
                }
        
                setChatList(response.data.chatList);
            } catch (error) {
                console.error(error);
            }
        }

    async function setTempUp(){

        axios.post(`/api/member2/setTempUp`, null ,{ params: { chatGroupId,memberId:loginUser.memberId } })
        .then((result) => {
            if(result.data.msg=='yes')
                alert("상대 온도가 상승되었습니다.")
            else{ alert("오류발생") }            
        })
        .catch((err) => { console.error(err); });
    }

    async function setTempDownAndBlock(){

        if(window.confirm("상대방을 차단합니다.")){
            axios.post(`/api/member2/setTempDown`, null ,{ params: { chatGroupId,memberId:loginUser.memberId } })
            .then((result) => {
                if(result.data.msg=='yes')
                    alert("상대 온도가 하락 되었습니다.")
                else{ alert("오류발생") }   
            })
            .catch((err) => { console.error(err); });            

            axios.post(`/api/member2/addBlockedFromRandomChat`, null ,{ params: { chatGroupId,memberId:loginUser.memberId } })
            .then((result) => {
                if(result.data.msg=='yes')
                    alert("상대가 차단 되었습니다.")
                else{ alert("오류발생") }   
            })
            .catch((err) => { console.error(err); });

        }        
    }


    return (
        <div className='chatRoomFromRandomContainer'>
        <div className='chatRoomFromRandomContents'>
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
                                    {/* <img src={`${process.env.REACT_APP_ADDRESS2}/userimg/${chat.sender.profileImg}`}/>&nbsp; */}
                                </div>
                                <div className='chatContent'>
                                    &nbsp; {formatDate(chat.createdDate)}&nbsp;<br/>{chat.content} &nbsp; 
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

        <div className='chatRoomEvaluateTemp'>
            <div>
                <button onClick={()=>setTempUp()}>좋아요</button>
                <button onClick={()=>setTempDownAndBlock()}>싫어요/차단</button>
            </div>
        </div>
        

      
    </div>
    )
}

export default ChatRoomFromRandom
