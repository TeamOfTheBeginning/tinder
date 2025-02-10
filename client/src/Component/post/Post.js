import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

import '../../style/Posts.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useSelector, useDispatch } from 'react-redux';
import { setFollowings } from '../../store/userSlice';
import { Cookies } from 'react-cookie';

const settings = {
    dot:false,
    arrows:false,
    infinite:false,
    speed:500,
    slidesToShow:1,
    slidesToScroll:1
}

const Post = (props) => {

    const [imgList, setImgList]=useState([])
    const [likeList, setLikeList] = useState([])
    const [replyView, setReplyView] = useState({})
    const [viewVal, setViewVal] = useState(false)
    const [ replyContent, setReplyContent] = useState('')
    const [replyList, setReplyList] = useState([])

    const dispatch = useDispatch()
    const cookies = new Cookies();

    // redux에 저장된 로그인 유저 로딩
    let loginUser = useSelector( state=>state.user ); 

    async function getNickname(id){
        // const result = await axios.get(`/api/member/getNickname/${id}`)
        // const nickname = result.data.nickname;
        // return result.data.nickname;
    }

    useEffect(
        ()=>{

            // setPostWriter( getNickname( props.post.member.nickname ) )

            axios.get(`/api/post/getImages/${props.post.postId}` )
            .then((result)=>{ 
                // console.log("result.data.imgList"+JSON.stringify(result.data.imgList))
                setImgList( result.data.imgList );
            }).catch((err)=>{console.error(err)})

            // axios.get(`/api/post/getLikeList/${props.post.id}`)
            // .then((result)=>{
            //      setLikeList( [...result.data.likeList ] );
            // }).catch((err)=>{console.error(err)})

            // axios.get(`/api/post/getReplyList/${props.post.id}`)
            // .then((result)=>{
            //     let temp = [...result.data.replyList];
            //     for(let i=0; i<temp.length; i++){
            //         temp[i].nickname = getNickname( temp[i].writer );
            //     }                    
            //     setReplyList([...temp]);
            // }).catch((err)=>{console.error(err)})

        },[]
    )

    async function onFollow(writer){
        // const writerNick = await getNickname(writer)
        // if( window.confirm(`${writerNick} 님을 팔로우 하시겠습니까?`) ){
        //     let result = await axios.post('/api/member/follow', { ffrom:loginUser.id,  fto:writer });

        //     result = await axios.get('/api/member/getLoginUser')
        //     props.setFollowings( [...result.data.followings] ) // 현재 운영중인  props.followings 변수 갱신
        //     dispatch( setFollowings(result.data.followings) )   // 리듀스 갱신
        //     //loginUser['followings'] = result.data.followings   // 현재 loginUser변수 갱신. 현재 화면에서는 갱신의 필요가 없음
        //     cookies.set('user', JSON.stringify( loginUser ) , {path:'/', })  // 쿠키 갱신
        // }else{
        //     return
        // }
    }

    async function onLike(){
        // 현재 로그인 유저의 닉네임과 현재 포스트의 id 로  like 작업
        // 현재 로그인 유저의 닉네임과 현재 포스트의 id 를 서버에 보내서 내역이 있으면 삭제 , 없으면 추가
        // likeList 재조회 & 갱신
        // let result = await axios.post('/api/post/addlike', { postid:props.post.id,  likeid:loginUser.id })

        // result = await axios.get(`/api/post/getLikeList/${props.post.id}` )
        // setLikeList( [...result.data.likeList] );
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
        // try{
            // 현재포스트의 아이디와 로그인유저의 닉네임과 replyContent 변수값으로 reply 테이블에 레코드를 추가합니다
            // let result = await axios.post('/api/post/addReply', {postid:props.post.id, writer:loginUser.id , content:replyContent})
            // setReplyContent('') // 댓글 추가후 댓글 입력란을 비웁니다

            // result = await axios.get(`/api/post/getReplyList/${props.post.id}`)
            // let temp = [...result.data.replyList];
            // for(let i=0; i<temp.length; i++){
            //     temp[i].nickname = getNickname( temp[i].writer );
            // }                    
            // setReplyList([...temp]);
        // }catch(err){ console.error(err) }
    }


    async function deleteReply(replyid){
        // if( window.confirm('해당 댓글을 삭제하시겠습니까?') ){
        //     let result = await axios.delete(`/api/post/deleteReply/${replyid}`)
        //     result = await axios.get(`/api/post/getReplyList/${props.post.id}`)

        //     let temp = [...result.data.replyList];
        //     for(let i=0; i<temp.length; i++){
        //         temp[i].nickname = getNickname( temp[i].writer );
        //     }                    
        //     setReplyList([...temp]);
        // }
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
        <div className='post'>
            <div className='writer' style={{display:"flex"}}>
                <div>{props.post.postId}&nbsp;&nbsp;</div>
                <div>{props.post.member.nickname}&nbsp;&nbsp;</div>
                <div>{formatDate(props.post.writedate)}</div>
                {
                    // ( 
                    //     ( props.post.member.memberId != loginUser.id) &&
                    //     ( !props.followings.some( (following)=>(props.post.writer==following.fto)) )
                    // )?
                    // (<button onClick={()=>{ onFollow(props.post.writer) }} >FOLLOW</button>):
                    // (null)
                }
                
            </div>
            <div>
            { 
                <Slider {...settings}>
                    {
                        (imgList)?(
                            imgList.map((img, idx)=>{
                                return (
                                    <img key={idx} src={`${process.env.REACT_APP_ADDRESS2}/uploads/${img.savefileName}`} width="750" height="700"/>
                                )
                            })
                        ):(null)
                    }    
                </Slider>
            }    
            </div>
            <div className='content' style={{fontWeight:"bold"}}><pre>{props.post.content}</pre></div>

            <div className='like'>
                {/* {
                    (likeList)?(
                        ( likeList.some( (like)=>( loginUser.id == like.likeid ) ) )?(
                            <img src={`http://localhost:8070/img/delike.png`}  onClick={ ()=>{ onLike() } } />
                        ):(
                            <img src={`http://localhost:8070/img/like.png`} onClick={ ()=>{ onLike() } } />
                        )
                    ):(
                        <span>Loading....</span>
                    )
                } */}
                &nbsp;&nbsp;
                <img src={`http://localhost:8070/img/reply.png`} onClick={()=>{ ViewOrNot() }} /> 
                &nbsp;&nbsp;
                {
                    // (likeList)?(
                    //     (likeList.length>=1)?(
                    //         <span>{likeList.length}명이 좋아합니다</span>
                    //     ):(
                    //         <span>아직 좋아요가 없어요</span>
                    //     )
                    // ):(
                    //     <span>Loading....</span>
                    // )
                }
            </div>

            <div className='reply'  style={replyView}>
                <div style={{ display:'flex', flexDirection:'column' }} >
                    {/* {
                        (replyList)?(
                            replyList.map((reply, idx)=>{
                                return (
                                    <div key={idx} style={{display:'flex', margin:'5px 3px'}}>
                                        <div style={{flex:"1", fontWeight:"bold"}}>{ reply.nickname}&nbsp;</div>
                                        <div style={{flex:"5"}}>{reply.content}</div>
                                        {
                                            (reply.writer===loginUser.id)?(
                                                <button style={{flex:"1"}} onClick={
                                                    ()=>{ deleteReply(reply.id) }
                                                }>삭제</button>
                                            ):(<div style={{flex:"1"}}></div>)
                                        }
                                        
                                    </div>
                                )
                            })
                        ):(<div>Loading...</div>)
                    } */}
                    
                </div>
                {/* <div  style={{ display:'flex' }} >
                    <input type="text"  style={{flex:"5"}} value={replyContent} onChange={
                        (e)=>{setReplyContent(e.currentTarget.value)}
                    }/>
                    <button  style={{flex:"1"}} onClick={
                        ()=>{ addReply() }
                    }>댓글입력</button>
                </div> */}
            </div>
        </div>
    )
}

export default Post
