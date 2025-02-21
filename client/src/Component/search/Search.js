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

  async function findMemberWithNickname(){

    axios.get(`/api/member2/getMembersWithNickname`, { params: { word, memberId:loginUser.memberId } })
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

  async function block(memberId){

    axios.post(`/api/member2/addBlockedFromSearch`, null ,{ params: { blockedId : memberId , blockerId : loginUser.memberId } })
    .then((result) => {
        if(result.data.msg=='yes'){alert("상대가 차단 되었습니다.")}
        else if(result.data.msg=='no')    {alert("차단 해제 되었습니다.")}        
        else{ alert("오류발생") }
    })
    .catch((err) => { console.error(err); });
  }

  function setMessageRoom(){
    if(!inviteMemberList){
      return alert("맴버를 선택하세요");
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

  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const mbtiList = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP"
  ];
  

  const handleChange = (event) => {
    const value = event.target.value.toUpperCase();
    setInputValue(value);
    
    if (value) {
      const filteredList = mbtiList.filter(mbti => mbti.startsWith(value));
      setSuggestions(filteredList);
    } else {
      setSuggestions([]);
    }
  };  

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 숫자 값으로 변환
    const mbtiToNumber = {
      "E": "0", "I": "1",
      "N": "0", "S": "1",
      "T": "0", "F": "1",
      "J": "0", "P": "1"
    };    

    const numberValue = inputValue.split('').map(char => mbtiToNumber[char]).join('');

    console.log("numberValue"+numberValue)

    try {
      // 서버에 데이터 전송
      const response = await axios.get('/api/member2/getMembersWithMBTI', { params:{numberValue,memberId:loginUser.memberId} });
      console.log(response.data); // 응답 처리
      setMemberList(response.data.memberList)
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };


  return (
    <div className='searchContainer'>
        <h3>맴버를 검색합니다. <br/> 나를 차단한 사용자는 검색되지 않습니다.</h3>
        <div className='searchContainerInput'>
            
            <div className='searchContainerNickname'>
            <input onChange={(e) => { setWord(e.target.value) }}placeholder="닉네임 입력"></input><button onClick={()=>findMemberWithNickname()}>맴버</button>
            </div>

            <div className='searchContainerMBTI'>   
              <div>
                <form onSubmit={handleSubmit}>
                  <input 
                    type="text" 
                    value={inputValue} 
                    onChange={handleChange} 
                    placeholder="MBTI 입력"
                  />
                  <button type="submit">전송</button>
                </form>
                {suggestions.length > 0 && (
                  <ul>
                    {suggestions.map((suggestion, index) => (
                      <li 
                        key={index}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>           
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
                            <div onClick={()=>block(member.memberId)}><button>차단/해제</button></div>
                            <div onClick={()=>inviteMemberForMessage(member)}><button>대화초대</button></div>
                        </div>
                    )
                })
            ):("Loading...")
        }
        </div>
        <div>
          <h3>초대 목록</h3>
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
