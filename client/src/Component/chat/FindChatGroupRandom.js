import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import ChatGroupRandom from './ChatGroup';

import '../../style/findchatgroup.css';

const FindChatGroupRandom = () => {

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
        <div className='chatRandomContainer'>
            <div className='chatRandomBtns'>
                <button>랜덤쪽지보내기</button>
            </div>

            {
        (chatGroupList)?(
            chatGroupList.map((chatGroup, idx)=>{
            return (
                <div key={idx} className='findChatGroupListContainer'>
                    <ChatGroupRandom chatGroup={chatGroup}/>
                </div>
            )
            })
        ):("Loading...")
        }
        
        </div>
    )
}

export default FindChatGroupRandom
