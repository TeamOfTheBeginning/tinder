import {  Routes, Route } from "react-router-dom";
import Login from './Component/Login';
import Main from './Component/Main';
import './App.css';
import JoinForm from "./Component/member/JoinForm";
import MyPage from "./Component/member/MyPage";
import Match from "./Component/match/Match";
import EditProfile from "./Component/member/EditProfile";
import FindLiker from "./Component/match/FindLiker"
import WritePost from "./Component/post/WritePost"
import MatchedMember from "./Component/match/MatchedMember"
import FindChatGroup from "./Component/chat/FindChatGroup"
import ChatRoomFromChatGroup from "./Component/chat/ChatRoomFromChatGroup";
import ChatRoomFromMatch from "./Component/chat/ChatRoomFromMatch"
import ChatRoomFromRandom from "./Component/chat/ChatRoomFromRandom"
import RealTimeChat from "./Component/realtimechat/RealTimeChat"
import Search from "./Component/search/Search"


function App() {
  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/joinForm" element={<JoinForm />} />
        <Route path="/mypage" element={<MyPage/>} />
        <Route path="/match" element={<Match />} />
        <Route path="/editProfile" element={<EditProfile/>}/>
        <Route path="/findLiker" element={<FindLiker/>}/>
        <Route path="/writePost" element={<WritePost />}/>
        <Route path="/matchedMember" element={<MatchedMember/>}/>
        <Route path="/findChatGroup" element={<FindChatGroup/>}/>
        <Route path="/chatRoomFromChatGroup/:chatGroupId" element={<ChatRoomFromChatGroup/>}/>
        <Route path="/chatRoomFromMatch/:memberId" element={<ChatRoomFromMatch/>}/>
        <Route path="/chatRoomFromRandom/:chatGroupId" element={<ChatRoomFromRandom/>}/>
        <Route path="/realtimechat" element={<RealTimeChat />} />
      </Routes>
    </div>
  );
}

export default App;
