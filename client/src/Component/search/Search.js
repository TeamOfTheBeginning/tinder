import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';

import { useNavigate, useParams } from "react-router-dom";

import '../../style/search.css';

const Search = () => {
  const [memberList, setMemberList] = useState();
  const [word, setWord] = useState();
  const [inviteMemberList,setInviteMemberList] =useState();
  const [inviteMemberIdList,setInviteMemberIdList] =useState();

  const navigate = useNavigate();
  const loginUser = useSelector(state=>state.user);

  async function findMember(){

    axios.get(`/api/member2/getMembersWithNickname`, { params: { word } })
    .then((result)=>{
      console.log(result.data.memberList)
      setMemberList(result.data.memberList)
    }
    ).catch((err)=>{console.error(err)}) 

  }

  function enterChatRoomFromSearchedMember(memberId){

    navigate(`/chatRoomFromMatch/${memberId}`);

  }

  function inviteMemberForMessage(member){
    setInviteMemberList((prevList) => {
      if (!Array.isArray(prevList)) {
        return [member.nickname]; // 만약 prevList가 배열이 아니면 새로운 배열로 초기화
      }
      return [...prevList, member.nickname]; // 배열에 memberId를 추가
    });
    setInviteMemberIdList((prevList) => {
      if (!Array.isArray(prevList)) {
        // 초기화 시 중복되지 않도록 새 배열 설정
        return [member.memberId];
      }
      
      // prevList에 이미 존재하는 memberId를 추가하지 않도록 조건을 추가
      const newInviteList = new Set(prevList); // Set을 사용하여 중복 제거
      newInviteList.add(member.memberId);
      
      return [...newInviteList];  // Set을 배열로 변환해서 반환
    });
  }

  function enterChatRoomFromChatGroup(chatGroupId){
    console.log(chatGroupId);        
    navigate(`/chatRoomFromChatGroup/${chatGroupId}`);
  }

  function setMessageRoom(){
    if(!inviteMemberList){
      alert("맴버를 선택하세요");
    }

    console.log("inviteMemberList : "+inviteMemberList)
    console.log("inviteMemberIdList : "+inviteMemberIdList)

    const inviteMemberListStr = inviteMemberIdList.join(",");

    axios.post(`/api/chat/setMessageRoom`,null ,{ params: { 
      inviteMemberIdList: inviteMemberListStr , memberId:loginUser.memberId
    } } )
    .then((result)=>{
      console.log("result.data.chatGroupId"+result.data.chatGroupId)
      enterChatRoomFromChatGroup(result.data.chatGroupId);
    }
    ).catch((err)=>{console.error(err)}) 
    
  }


  return (
    <div className='searchContainer'>
        
        <div className='searchContainerInput'>
            <input onChange={(e) => { setWord(e.target.value) }}></input>
            <div className='searchContainerBtns'>
              <button onClick={()=>findMember()}>맴버</button>
              <button>MBTI</button>
              {/* <button>해쉬태그</button> */}
            </div>
        </div>
        <div className='searchResult'>
        {
            (memberList)?(
              memberList.map((member, idx)=>{
                    return (
                        <div key={idx}>
                            
                            
                            <div className='searchMemberImg'><img src={`${process.env.REACT_APP_ADDRESS2}/userimg/${member.profileImg}`}/></div>{member.nickname}&nbsp; 
                            <div onClick={()=>enterChatRoomFromSearchedMember(member.memberId)}><button>쪽지</button></div>

                            <div onClick={()=>inviteMemberForMessage(member)}><button>대화초대</button></div>
                        </div>
                    )
                })
            ):("Loading...")
        }
        </div>
        <div>
          <h3>Invited Members:</h3>
            <ul>
              {/* 리스트의 내용을 화면에 출력 */}
              {(inviteMemberList)?
              (inviteMemberList.map((member, index) => (
                <li key={index}>{member}</li>
              ))):("")}
            </ul>
            <button onClick={()=>setMessageRoom()}>초대</button>
        </div>
      
    </div>
  )
}

export default Search
