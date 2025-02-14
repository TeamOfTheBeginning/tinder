import React, {useState, useEffect} from 'react'
import '../../style/mypage.css'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import SideBar from '../SideBar';
import { useSelector } from 'react-redux';
import Modal from './FollowModal';



const MyPage = () => {

    const loginUser = useSelector( state=>state.user );
    const [ imgSrc, setImgSrc ]=useState('');
    const navigate=useNavigate();
    const [word, setWord] = useState('n');
    const [imgList, setImgList] = useState([]);
    const [isFollowerModalOpen, setIsFollowerModalOpen] = useState(false);
    const [isFollowedModalOpen, setIsFollowedModalOpen] = useState(false);


    const toggleFollowerModal = () => {
        setIsFollowerModalOpen(!isFollowerModalOpen);
      };
      
      const toggleFollowedModal = () => {
        setIsFollowedModalOpen(!isFollowedModalOpen);
      };
      

    
    useEffect(
        ()=>{
            if( loginUser.profileImg ){
                setImgSrc(`http://localhost:8070/userImg/${loginUser.profileImg}`);
            }

            console.log(loginUser.followed);
        
        },[]
    )

    return (
        <div className='mypage'>
            <SideBar  setWord={setWord}/>
            <div className='userinfo'>
                <div className='img'>
                    <img src={imgSrc} />
                </div>
                <div className='profile'>
                    <div className='field'>
                        <label>E-mail</label>
                        <div>{loginUser.email}</div>
                    </div>
                    <div className='field'>
                        <label>Nick Name</label>
                        <div>{loginUser.nickname}</div>
                    </div>
                    <div className='field'>
                        <label onClick={toggleFollowerModal} style={{cursor:'pointer'}}>Follower</label>
                        <div>
                            {
                                (loginUser.followed)?(loginUser.followed.length):(0)
                            }
                        </div>
                    </div>
                    <div className='field'>
                        <label onClick={toggleFollowedModal} style={{cursor:'pointer'}} >Followed</label>
                        <div>
                            {
                                (loginUser.follower)?(loginUser.follower.length):(0)
                            }
                        </div>
                    </div>
                    <div className='field'>
                        <label>intro</label>
                        <div>{loginUser.profileMsg}</div>
                    </div>
                </div>
            </div>

            <div className='btns' >
                <div id ="btn" onClick={()=>{ navigate('/editProfile')}}>Edit Profile</div>
                <div id ="btn">Post Write</div>
            </div>

            <Modal isOpen={isFollowerModalOpen} onClose={toggleFollowerModal}>
            <h2>나를 팔로우한 사용자</h2>
            <ul>
                {loginUser.followed && loginUser.followed.map((followed, index) => (
                <li key={index}> {/* key는 index가 아닌 고유한 값을 사용하는 것이 좋습니다 (예: followed.followId) */}
                    팔로워 nickname: {followed.follower.nickname}, profile: <img src={`http://localhost:8070/userImg/${followed.follower.profileImg}`} style={{width : '70px', height:'70px'}} /> 
                    
                </li>
                ))}
            </ul>
            </Modal>

            <Modal isOpen={isFollowedModalOpen} onClose={toggleFollowedModal}>
            <h2>내가 팔로우한 사용자</h2>
            <ul>
                {loginUser.follower && loginUser.follower.map((follower, index) => (
                <li key={index}>
                    팔로우 nickname: {follower.followed.nickname}, profile: <img src={`http://localhost:8070/userImg/${follower.followed.profileImg}`} style={{width : '70px', height:'70px'}} />
                </li>
                ))}
            </ul>
            </Modal>



                    
         

            {/* <div className='userpost' >
                {
                    (imgList)?(
                        imgList.map((imgs, idx)=>{
                            return (
                                <div key={idx}>
                                    <img src={`http://localhost:8070/images/${imgs}`} />
                                </div>
                            )
                        })
                    ):(<div>Loading...</div>)
                }
            </div> */}
        </div>
    )
}

export default MyPage
