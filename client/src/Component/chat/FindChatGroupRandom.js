import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import ChatGroupRandom from './ChatGroupRandom';

import '../../style/message/findchatgroup.css';
import LoadingSpinner from "../LoadingSpinner";

import jaxios from '../../util/jwtUtil';

const FindChatGroupRandom = (props) => {

    const navigate = useNavigate();
    const loginUser = useSelector(state=>state.user);
    const [chatGroupList, serChatGroupList] = useState();

    useEffect(() => {
        // console.log(loginUser)
        jaxios.get(`/api/chat/findChatGroupRandom`, { params: { memberId:loginUser.memberId } })
            .then((result) => {
                // console.log("result.data.chatGroupList: " + JSON.stringify(result.data.chatGroupList));
                serChatGroupList(result.data.chatGroupList);
            })
            .catch((err) => { console.error(err); });
    }, []);

    function enterChatRoomFromChatGroupRandom(chatGroupId){
        // console.log(chatGroupId);
        navigate(`/chatRoomFromRandom/${chatGroupId}`);
    }

    function setAnonymousMessageRoom(){
        // console.log("setAnonymousMessageRoom")
        jaxios.post(`/api/chat/setAnonymousMessageRoom`,null ,{ params: { 
            memberId:loginUser.memberId
          } } )
          .then((result)=>{
            jaxios.get(`/api/chat/findChatGroupRandom`, { params: { memberId:loginUser.memberId } })
            .then((result) => {
                // console.log("result.data.chatGroupList: " + JSON.stringify(result.data.chatGroupList));
                serChatGroupList(result.data.chatGroupList);
            })
            .catch((err) => { console.error(err); });
          }
        ).catch((err)=>{console.error(err)}) 
    }

    return (
        <div className='findChatGroupContainer'>
            <div className='chatGroupHeader'>
                <div className='btns'>
                    <button className='btn' onClick={() => setAnonymousMessageRoom()}>🎲 랜덤 메시지방 생성 🎲
                    </button>
                </div>
            </div>
            {chatGroupList ? (
                chatGroupList.map((chatGroup, idx) => (
                    <div key={idx} className='findRandomChatListContainer'>
                        <ChatGroupRandom chatGroup={chatGroup} setSubMenuData={props.setSubMenuData} openSubMenu={props.openSubMenu} />
                    </div>
                ))
            ) : (
                <LoadingSpinner />
            )}
        </div>
    );
}

export default FindChatGroupRandom
