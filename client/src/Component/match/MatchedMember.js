import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import '../../style/match/matchedmember.css';

import jaxios from '../../util/jwtUtil';

const MatchedMember = (props) => {

    const loginUser = useSelector(state=>state.user);
    const navigate = useNavigate();
    const [matchedMemberList, serMatchedMemberList] = useState();

    useEffect(() => {
        // console.log(loginUser)
        jaxios.get(`/api/member2/getMatchedMember`, { params: { memberId:loginUser.memberId } })
        .then((result) => {
            // console.log("result.data.likerList: " + JSON.stringify(result.data.likerList));
            serMatchedMemberList(result.data.matchedMemberList);
        })
        .catch((err) => { console.error(err); });
    }, []);

    function enterChatRoomFromMatchedMember(memberId){
        // console.log(memberId);
        props.openSubMenu('chatRoomFromMatch', memberId)
        // navigate(`/chatRoomFromMatch/${memberId}`);
    }

    return (
        <div className='matchedMemberContainer'>
            {
                (matchedMemberList)?(
                    matchedMemberList.map((matchedMember, idx)=>{
                        return (
                            <div key={idx} className='matchedMemberListContainer'>
                                <div className='matchedMemberLeft'>
                                    <img src={`http://localhost:8070/userimg/${matchedMember.profileImg}`} />
                                    <br/>
                                </div>

                                <div className='matchedMemberRight'>
                                    <div className='matchedMemberProfile'>  
                                        {matchedMember.nickname}
                                        ({matchedMember.age})<br/>
                                        {matchedMember.profileMsg}
                                    </div>
                                    <div className='matchedMemberBtns'>                     
                                        <button onClick={()=>enterChatRoomFromMatchedMember(matchedMember.memberId)}>쪽지</button>
                                    </div>
                                </div>
                            </div>
                                )
                            })
                        ):(null)
            }      
        </div>
    )
}

export default MatchedMember
