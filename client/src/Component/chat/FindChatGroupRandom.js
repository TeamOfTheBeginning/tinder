import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ChatGroupRandom from './ChatGroupRandom';

// import '../../style/message/findchatgrouprandom.css';
// css 최대한 재활용 할 수 있도록 정리중
import '../../style/message/findchatgroup.css';

import jaxios from '../../util/jwtUtil';

const FindChatGroupRandom = ({openSubMenu}) => {

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

    // return (
    //     <div className='findChatGroupContainer'>
    //         <div className='chatGroupInfo'>
    //             <div className='chatGroupBtns'>
    //                 <button className='chatGroupbtn' onClick={()=>setAnonymousMessageRoom()}>랜덤쪽지</button>
    //             </div>
    //         </div>
    //     {
    //         (chatGroupList)?(
    //             chatGroupList.map((chatGroup, idx)=>{
    //             return (
    //                 <div key={idx} className='findChatGroupListContainer'>
    //                     <ChatGroupRandom chatGroup={chatGroup}  openSubMenu={openSubMenu}/>
    //                 </div>
    //             )
    //             })
    //         ):("Loading...")
    //     }
        
    //     </div>
    // )
    return (
        <div className='findChatGroupContainer'>
            <div className='chatGroupHeader'>
                <div className='chatGroupBtns'>
                    <button className='chatGroupBtn' onClick={() => setAnonymousMessageRoom()}>
                        랜덤쪽지
                    </button>
                </div>
            </div>
            {chatGroupList ? (
                chatGroupList.map((chatGroup, idx) => (
                    <div key={idx} className='findChatGroupListContainer'>
                        <ChatGroupRandom chatGroup={chatGroup} openSubMenu={openSubMenu} />
                    </div>
                ))
            ) : (
                "Loading..."
            )}
        </div>
    );
}

export default FindChatGroupRandom
