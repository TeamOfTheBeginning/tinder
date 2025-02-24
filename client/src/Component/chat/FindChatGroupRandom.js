import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import ChatGroupRandom from './ChatGroupRandom';

import '../../style/message/findchatgrouprandom.css';

import jaxios from '../../util/jwtUtil';

const FindChatGroupRandom = () => {

    const navigate = useNavigate();
    const loginUser = useSelector(state=>state.user);

    const [chatGroupList, serChatGroupList] = useState();

    useEffect(() => {
        console.log(loginUser)
        jaxios.get(`/api/chat/findChatGroupRandom`, { params: { memberId:loginUser.memberId } })
            .then((result) => {
                console.log("result.data.chatGroupList: " + JSON.stringify(result.data.chatGroupList));
                serChatGroupList(result.data.chatGroupList);
            })
            .catch((err) => { console.error(err); });
    }, []);

    function enterChatRoomFromChatGroupRandom(chatGroupId){
        console.log(chatGroupId);
        navigate(`/chatRoomFromRandom/${chatGroupId}`);
    }

    function setAnonymousMessageRoom(){
        console.log("setAnonymousMessageRoom")
        

        jaxios.post(`/api/chat/setAnonymousMessageRoom`,null ,{ params: { 
            memberId:loginUser.memberId
          } } )
          .then((result)=>{
            console.log("result.data.chatGroupId"+result.data.chatGroupId)
            enterChatRoomFromChatGroupRandom(result.data.chatGroupId);
          }
          ).catch((err)=>{console.error(err)}) 

    }




    return (
        <div className='findChatGroupRandomContainer'>
            <div className='findChatGroupRandomBtns'>
                <button onClick={()=>setAnonymousMessageRoom()}>랜덤쪽지</button>
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
