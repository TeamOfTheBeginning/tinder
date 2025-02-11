import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";

import { CgProfile } from "react-icons/cg";
import { IoHomeSharp, IoSparkles, IoSearch, IoLogOut } from "react-icons/io5";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

import '../style/sidebar.css'

const SideBar = () => {

  const loginUser = useSelector( state=>state.user );
  const [ imgSrc, setImgSrc ]=useState('');
  const navigate = useNavigate();

  useEffect(
          ()=>{
              if( loginUser.profileImg ){
                  setImgSrc(`http://localhost:8070/userimg/${loginUser.profileImg}`);
              }
          },[]
  )

  return (
    <div className='SideBar'>
      <div className='MenuBar'>
        <div className='MenubarBtns'>
            <div id='btn'><img src={imgSrc} /></div>
            <div id='btn'><IoHomeSharp /></div>
            
            {/* <div id='btn' onClick={
              ()=>{navigate('/writePost')}
              }><MdOutlineAddPhotoAlternate /></div> */}
            <div id='btn'><MdOutlineAddPhotoAlternate /></div>

            <div id='btn' onClick={
              ()=>{navigate('/match')}
              }><IoSparkles /></div>
            <div id='btn' onClick={
              ()=>{navigate('/myPage')}
              }><CgProfile /></div>
            <div id='btn' onClick={
              ()=>{navigate('/')}
              }><IoSearch /></div>
            <div id='btn' onClick={
              ()=>{
                // onLogout();
              navigate('/#')}
              }><IoLogOut /></div>
        </div>
      </div>

      <div className='SidebarContent'>

      </div>
    </div>
  )
}

export default SideBar
