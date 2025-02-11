import {  Routes, Route } from "react-router-dom";
import Login from './Component/Login';
import Main from './Component/Main';
import './App.css';
import JoinForm from "./Component/member/JoinForm";
import MyPage from "./Component/member/MyPage";
import Match from "./Component/match/Match";
import EditProfile from "./Component/member/EditProfile";
import FindLiker from "./Component/match/FindLiker"
import Matched from "./Component/match/Matched"

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
        <Route path="/matched" element={<Matched/>}/>
      </Routes>
    </div>
  );
}

export default App;
