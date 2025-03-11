import {  Routes, Route } from "react-router-dom";
import './App.css';

import Login from './Component/Login';
import JoinForm from "./Component/member/JoinForm";
import Savekakaoinfo from './Component/member/Savekakaoinfo';
import Main from './Component/Main';
import MyPage from "./Component/member/MyPage";
import EditProfile from "./Component/member/EditProfile";
import EditOpponent from "./Component/member/EditOpponent";
import WritePost from "./Component/post/WritePost"
import Match from "./Component/match/Match";
import FindLiker from "./Component/match/FindLiker";
import MatchedMember from "./Component/match/MatchedMember";
import NearMember from "./Component/member/NearMember";
import FindChatGroup from "./Component/chat/FindChatGroup" 
import ChatRoomFromChatGroup from "./Component/chat/ChatRoomFromChatGroup";
import ChatRoomFromMatch from "./Component/chat/ChatRoomFromMatch"
import ChatRoomFromRandom from "./Component/chat/ChatRoomFromRandom"
import RealTimeChat from "./Component/realtimechat/RealTimeChat"
import Search from "./Component/search/Search"
import ChatBot from "./Component/chatbot/ChatBot";


function App() {
  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/joinForm" element={<JoinForm />} />
        <Route path="/savekakaoinfo/:kakaoEmail" element={<SaveKakaoInfo />} />
        <Route path="/main" element={<Main />} />
        {/* SideView-기능별화면 */}
        <Route path="/mypage" element={<MyPage/>} />
        <Route path="/editProfile" element={<EditProfile/>}/>
        <Route path="/editOpponent" element={<EditOpponent/>}/>
        <Route path="/writePost" element={<WritePost />}/>
        <Route path="/match" element={<Match />} />
        <Route path="/findLiker" element={<FindLiker/>}/>
        <Route path="/matchedMember" element={<MatchedMember/>}/>
        <Route path="/nearMember" element={<NearMember />} />
        <Route path="/chatRoomFromRandom/:chatGroupId" element={<ChatRoomFromRandom/>}/>
        <Route path="/findChatGroup" element={<FindChatGroup/>}/>
        <Route path="/chatRoomFromChatGroup/:chatGroupId" element={<ChatRoomFromChatGroup/>}/>
        <Route path="/chatRoomFromMatch/:memberId" element={<ChatRoomFromMatch/>}/>
        <Route path="/realtimechat" element={<RealTimeChat />} />
        
        <Route path="/chatbot" element={<ChatBot />} />
      </Routes>
    </div>
  );
}

export default App;
