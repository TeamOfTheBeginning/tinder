import {  Routes, Route } from "react-router-dom";
import Login from './Component/Login';
import Main from './Component/Main';
import './App.css';
import JoinForm from "./Component/member/JoinForm";
import Match from "./Component/match/Match";

function App() {
  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/joinForm" element={<JoinForm />} />
        <Route path="/match" element={<Match />} />
      </Routes>
    </div>
  );
}

export default App;
