import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import { CgProfile } from "react-icons/cg";
import { IoHomeSharp, IoSparkles, IoSearch, IoLogOut } from "react-icons/io5";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { TbMailHeart } from "react-icons/tb";

import '../style/sidebar.css'

const SideBar = () => {

  const loginUser = useSelector( state=>state.user );
  const [ profileImg, setProfileImg ]=useState('');
  const navigate = useNavigate();

  useEffect(
          ()=>{
              if( loginUser.profileImg ){
                setProfileImg(`http://localhost:8070/userImg/${loginUser.profileImg}`);
              }
          },[]
  )

  return (
    <div className='MenuBar'>
        <div className='MenubarBtns'>
          <div className='profileImg' id='btn'><img src={profileImg} /></div>
            
          <div className='btn' onClick={
              ()=>{navigate('/main')}
            }><IoHomeSharp /></div>
            
          <div className='btn' onClick={
              ()=>{navigate('/writePost')}
              }><MdOutlineAddPhotoAlternate /></div>

          <div className='matching btn' onClick={
              (SideViewer)=>{navigate('/match')}
              }><IoSparkles /></div>
            
          <div className='btn' onClick={
              ()=>{navigate('/findChatGroup')}}><TbMailHeart /></div>

          <div className='btn' onClick={
              ()=>{navigate('/myPage')}
              }><CgProfile /></div>

          <div className='btn' onClick={
              ()=>{navigate('/')}
              }><IoSearch /></div>

          <div className='btn' onClick={
              ()=>{
              navigate('/#')}
              }><IoLogOut /></div>
        </div>
      
      <div className='SideViewer'>
        
      </div>
    </div>
  )

  // return (
  //       <div className='MenuBar'>
  //           <div className='MenubarBtns'>
  //               <div className='profileImg' id='btn'><img src={profileImg} /></div>
  //               <div className='btn' onClick={() => onMenuSelect('main')}><IoHomeSharp /></div>
  //               <div className='btn' onClick={() => onMenuSelect('writePost')}><MdOutlineAddPhotoAlternate /></div>
  //               <div className='matching btn' onClick={() => onMenuSelect('match')}><IoSparkles /></div>
  //               <div className='btn' onClick={() => onMenuSelect('findChatGroup')}><TbMailHeart /></div>
  //               <div className='btn' onClick={() => onMenuSelect('myPage')}><CgProfile /></div>
  //               <div className='btn' onClick={() => onMenuSelect('search')}><IoSearch /></div>
  //               <div className='btn' onClick={() => onMenuSelect('logout')}><IoLogOut /></div>
  //           </div>
  //       </div>
  //   )
}

export default SideBar
