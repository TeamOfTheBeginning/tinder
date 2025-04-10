import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

import '../../style/posts.css';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiSolidMessageSquareDetail, BiSolidMessageSquareDots } from "react-icons/bi";
import LoadingSpinner from "../LoadingSpinner";

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useSelector, useDispatch } from 'react-redux';
import { setFollower } from '../../store/userSlice';
import { Cookies } from 'react-cookie';

import jaxios from '../../util/jwtUtil'

const settings = {
    dot:false,
    arrows:false,
    infinite:false,
    speed:500,
    slidesToShow:1,
    slidesToScroll:1
}

const ToastPopupPost = (props) => {
    const [imgList, setImgList]=useState([])
    const [likeList, setLikeList] = useState([])
    const [replyView, setReplyView] = useState({})
    const [viewVal, setViewVal] = useState(false)
    const [replyContent, setReplyContent] = useState('')
    const [replyList, setReplyList] = useState([])

    const dispatch = useDispatch()
    const cookies = new Cookies();

    // redux에 저장된 로그인 유저 로딩
    let loginUser = useSelector( state=>state.user ); 

    async function getNickname(memberId){
        // const result = await axios.get(`/api/member/getNickname/${memberId}`)
        // const nickname = result.data.nickname;
        // return result.data.nickname;
    }

    useEffect(
        ()=>{

            // setPostWriter( getNickname( props.post.member.nickname ) )

            jaxios.get(`/api/post/getImages/${props.postOne.postId}` )
            .then((result)=>{ 
                // console.log("result.data.imgList"+JSON.stringify(result.data.imgList))
                setImgList( result.data.imgList );
            }).catch((err)=>{console.error(err)})

            jaxios.get(`/api/post/getLikeList/${props.postOne.postId}`)
            .then((result)=>{
                // console.log("result.data.likeList"+JSON.stringify(result.data.likeList))
                 setLikeList( [...result.data.likeList ] );
            }).catch((err)=>{console.error(err)})

            jaxios.get(`/api/post/getReplyList/${props.postOne.postId}`)
            .then((result)=>{
                // console.log(result.data.replyList2)
                let temp = [...result.data.replyList2];
                for(let i=0; i<temp.length; i++){
                    temp[i].nickname = getNickname( temp[i].writer );
                }                    
                setReplyList([...temp]);
            }).catch((err)=>{console.error(err)})

        },[]
    )

    async function onFollow(memberId){
        if( window.confirm(`${props.postOne.member.nickname} 님을 팔로우 하시겠습니까?`) ){
            let result = await jaxios.post('/api/member/follow', { follower:loginUser.memberId,  followed:memberId });

            // result = await axios.get('/api/member/getLoginUser')
            // props.setFollower( [...result.data.follower] ) // 현재 운영중인  props.followings 변수 갱신
            // dispatch( setFollower(result.data.follower) )   // 리듀스 갱신
            // loginUser['followings'] = result.data.followings   // 현재 loginUser변수 갱신. 현재 화면에서는 갱신의 필요가 없음
            cookies.set('user', JSON.stringify( loginUser ) , {path:'/', })  // 쿠키 갱신
        }else{
            return
        }
    }

    async function onLike(){
        // 현재 로그인 유저의 닉네임과 현재 포스트의 id 로  like 작업
        // 현재 로그인 유저의 닉네임과 현재 포스트의 id 를 서버에 보내서 내역이 있으면 삭제 , 없으면 추가
        // likeList 재조회 & 갱신
        let result = await jaxios.post('/api/post/addLike',null ,{params:{ postId:props.postOne.postId,  memberId:loginUser.memberId }})

        result = await jaxios.get(`/api/post/getLikeList/${props.postOne.postId}` )
        setLikeList( [...result.data.likeList] );
    }

    useEffect(
        ()=>{
            if( viewVal ){
                setReplyView({display:'block'})
            }else{
                setReplyView({display:'none'})
            }
        }, [viewVal]
    )

    function ViewOrNot(){
        setViewVal( !viewVal ) // 현재 viewVal 변수값의 반대값으로 저장
    }

    async function addReply(){
        try{
            // 현재포스트의 아이디와 로그인유저의 닉네임과 replyContent 변수값으로 reply 테이블에 레코드를 추가합니다
            let result = await jaxios.post('/api/post/addReply', null ,{params :{postId:props.postOne.postId, memberId:loginUser.memberId , content:replyContent}})
            setReplyContent('')
            // 댓글 추가후 댓글 입력란을 비웁니다

            jaxios.get(`/api/post/getReplyList/${props.postOne.postId}`)
            .then((result)=>{
                // console.log(result.data.replyList2)
                let temp = [...result.data.replyList2];
                for(let i=0; i<temp.length; i++){
                    temp[i].nickname = getNickname( temp[i].writer );
                }                    
                setReplyList([...temp]);
            }).catch((err)=>{console.error(err)})
        }catch(err){ console.error(err) }
    }


    async function deleteReply(replyId){
        if( window.confirm('해당 댓글을 삭제하시겠습니까?') ){
            let result = await jaxios.delete(`/api/post/deleteReply/${replyId}`)

            jaxios.get(`/api/post/getReplyList/${props.post.postId}`)
            .then((result)=>{
                // console.log(result.data.replyList2)
                let temp = [...result.data.replyList2];
                for(let i=0; i<temp.length; i++){
                    temp[i].nickname = getNickname( temp[i].writer );
                }                    
                setReplyList([...temp]);
            }).catch((err)=>{console.error(err)})
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString); // ISO 8601 형식의 문자열을 Date 객체로 변환
    
        const day = String(date.getDate()).padStart(2, '0'); // 일 (2자리로 맞추기)
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1)
        const year = String(date.getFullYear()).slice(-2); // 년 (끝 두 자리만 사용)
        
        const hours = String(date.getHours()).padStart(2, '0'); // 시간
        const minutes = String(date.getMinutes()).padStart(2, '0'); // 분
        
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    return (
        <div className='toastPopupPost'>
            <div className='writer' style={{display:"flex"}}>
                <div> 오늘의 추천 게시물 <br /></div>
                <div>&nbsp;&nbsp;{props.postOne.postId}&nbsp;&nbsp;</div>
                <div>{props.postOne.member.nickname}&nbsp;&nbsp;</div>
                <div style={{marginRight:10}}>{formatDate(props.postOne.writedate)}</div>
                {
                    ( 
                        ( props.postOne.member.memberId != loginUser.memberId) &&
                        ( !props.follower?.some( (follower)=>(props.postOne.member.memberId==follower.followed)) )
                    )?
                    (<button id='blueBtn' onClick={()=>{ onFollow(props.postOne.member.memberId) }} >FOLLOW</button>):
                    (null)
                }
                
            </div>
            <div id='imgbox'>
            {imgList.map(img => {
                    // 이미지 파일인지 확인
                    const isImage = img.savefileName.match(/\.(jpeg|jpg|png|gif)$/i);
                    // 비디오 파일인지 확인
                    const isVideo = img.savefileName.match(/\.(mp4|webm|ogg)$/i);

                    return (
                        isImage ? (
                            <img key={img.savefileName} src={`${process.env.REACT_APP_ADDRESS2}/userimg/${img.savefileName}`}
                            // width="750" height="700" 
                            alt="Post" />
                        ) : isVideo ? (
                            <video key={img.savefileName} 
                            // width="750" height="700"  
                            controls autoPlay muted playsInline loop>
                                <source src={`${process.env.REACT_APP_ADDRESS2}/userimg/${img.savefileName}`} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : null
                    );
                })}
            </div>
            <div className='content' style={{fontWeight:"bold"}}><pre>{props.postOne.content}</pre></div>

            <div className='like'>
                {
                    (likeList)?(
                        ( likeList.some( (like)=>( loginUser.memberId == like.member.memberId ) ) )?(
                            <AiFillHeart id='icons' onClick={ ()=>{ onLike() } } />
                        ):(
                            <AiOutlineHeart id='icons' onClick={ ()=>{ onLike() } } />
                        )
                    ):(
                        <LoadingSpinner />
                    )
                }
                &nbsp;&nbsp;
                <BiSolidMessageSquareDetail id='icons' onClick={()=>{ ViewOrNot() }} />
                &nbsp;&nbsp;
                {
                    (likeList)?(
                        (likeList.length>=1)?(
                            <span>{likeList.length}명이 좋아합니다</span>
                        ):(
                            <span>아직 좋아요가 없어요</span>
                        )
                    ):(
                        <LoadingSpinner />
                    )
                }
            </div>

            <div className='reply'  style={replyView}>
                <div style={{ display:'flex', flexDirection:'column' }} >
                    {
                        (replyList)?(
                            replyList.map((reply, idx)=>{
                                return (
                                    <div key={idx} style={{display:'flex', margin:'5px 3px'}}>
                                        <div style={{flex:"1", fontWeight:"bold"}}>{ reply.member.nickname}&nbsp;</div>
                                        <div style={{flex:"5"}}>{reply.content}</div>
                                        {
                                            (reply.member.memberId===loginUser.memberId)?(
                                                <button style={{flex:"1"}} onClick={
                                                    ()=>{ deleteReply(reply.replyId) }
                                                }>삭제</button>
                                            ):(<div style={{flex:"1"}}></div>)
                                        }
                                        
                                    </div>
                                )
                            })
                        ):( <LoadingSpinner /> )
                    }
                    
                </div>
                <div style={{ display:'flex' }} >
                    <input type="text" style={{flex:"5"}} value={replyContent} onChange={
                        (e)=>{setReplyContent(e.currentTarget.value)}
                    }/>
                    <button id='pinkBtn' style={{flex:"1"}} onClick={
                        ()=>{ addReply() }
                    }>댓글입력</button>
                </div>
            </div>
        </div>
    )
}

export default ToastPopupPost
