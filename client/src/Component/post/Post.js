import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import '../../style/posts.css';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import LoadingSpinner from "../LoadingSpinner";
import { Cookies } from 'react-cookie';
import jaxios from '../../util/jwtUtil';

const Post = (props) => {
    const [imgList, setImgList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [likeList, setLikeList] = useState([]);
    const [replyView, setReplyView] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [replyList, setReplyList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoadingLikes, setIsLoadingLikes] = useState(true);
    const [isLoadingReplies, setIsLoadingReplies] = useState(true);

    const dispatch = useDispatch();
    const cookies = new Cookies();
    let loginUser = useSelector(state => state.user);

    // 데이터 로드
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setIsLoadingLikes(true);
            setIsLoadingReplies(true);
            try {
                const imgResult = await jaxios.get(`/api/post/getImages/${props.post.postId}`);
                setImgList(imgResult.data.imgList);

                const likeResult = await jaxios.get(`/api/post/getLikeList/${props.post.postId}`);
                setLikeList(likeResult.data.likeList);

                const replyResult = await jaxios.get(`/api/post/getReplyList/${props.post.postId}`);
                // let temp = await Promise.all(replyResult.data.replyList2.map(async (reply) => {
                //     reply.nickname = await getNickname(reply.writer);
                //     return reply;
                // }));
                setReplyList(replyResult.data.replyList2);
            } catch (err) {
                console.error(err);
                alert('데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoadingLikes(false);
                setIsLoadingReplies(false);
                setLoading(false);
            }
        };

        fetchData();
    }, [props.post.postId, loginUser.memberId]);

    // ✅ 슬라이드 이전 이미지로 이동
    const prevSlide = () => {
        setCurrentIndex(prevIndex => (prevIndex === 0 ? imgList.length - 1 : prevIndex - 1));
    };

    // ✅ 슬라이드 다음 이미지로 이동
    const nextSlide = () => {
        setCurrentIndex(prevIndex => (prevIndex === imgList.length - 1 ? 0 : prevIndex + 1));
    };

    // const getNickname = async (memberId) => {
    //     const result = await jaxios.get(`/api/member/getNickname/${memberId}`);
    //     return result.data.nickname;
    // };

    const onFollow = async (memberId) => {
        if (window.confirm(`${props.post.member.nickname} 님을 팔로우 하시겠습니까?`)) {
            try {
                await jaxios.post('/api/member/follow', null, { params: { follower: loginUser.memberId, followed: memberId } });
                const result = await jaxios.get('/api/member/getLoginUser', { params: { memberId: loginUser.memberId } });
                cookies.set('user', JSON.stringify(result.data), { path: '/' });
            } catch (err) {
                console.error(err);
            }
        }
    };

    const onLike = async () => {
        try {
            await jaxios.post('/api/post/addLike', null, {
                params: { postId: props.post.postId, memberId: loginUser.memberId }
            });
            const isLiked = likeList.some(like => like.member.memberId === loginUser.memberId);
            setLikeList(isLiked
                ? likeList.filter(like => like.member.memberId !== loginUser.memberId)
                : [...likeList, { member: { memberId: loginUser.memberId, nickname: loginUser.nickname } }]
            );
        } catch (err) {
            console.error(err);
        }
    };

    const toggleReplyView = () => {
        setReplyView(prev => !prev);
    };

    const addReply = async () => {
        try {
            const result = await jaxios.post('/api/post/addReply', null, {
                params: { postId: props.post.postId, memberId: loginUser.memberId, content: replyContent },
            });
            const newReply = {
                replyId: result.data.replyId,
                member: { memberId: loginUser.memberId, nickname: loginUser.nickname },
                content: replyContent,
            };
            setReplyContent('');
            setReplyList(prev => [newReply, ...prev]); // 새로운 댓글을 리스트에 추가
        } catch (err) {
            console.error(err);
        }
    };

    const deleteReply = async (replyId) => {
        if (window.confirm('해당 댓글을 삭제하시겠습니까?')) {
            try {
                await jaxios.delete(`/api/post/deleteReply/${replyId}`);
                setReplyList(prev => prev.filter(reply => reply.replyId !== replyId));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    // const videoRef = useRef(null);
    // const isMutedRef = useRef(true); // 🔥 상태 대신 ref 사용
    // const volumeRef = useRef(0.5); // 🔥 상태 대신 ref 사용

    // 사용자가 볼륨 변경 시 ref에 저장
    const handleVolumeChange = () => {
        if (props.videoRef.current) {
            props.setIsMuted(props.videoRef.current.muted);
            props.setVolume(props.videoRef.current.volume);
            console.log("props.videoRef.current.volume"+props.videoRef.current.volume);
        }
    };

    // // 컴포넌트가 새로 렌더링될 때 기존 볼륨 적용
    // useEffect(() => {
    //     if (videoRef.current) {
    //         videoRef.current.muted = isMutedRef.current;
    //         videoRef.current.volume = volumeRef.current;
    //     }
    // }, []); // 빈 배열 → 한 번만 실행 (새로 렌더링될 때만 실행됨)

    return (
        <div className='post'>
            <div className='writer'>
                <div>{props.post.postId}&nbsp;&nbsp;</div>
                <div>{props.post.member.nickname}&nbsp;&nbsp;</div>
                <div style={{ marginRight: 10 }}>{formatDate(props.post.writedate)}</div>
                {props.post.member.memberId !== loginUser.memberId &&
                    !props.follower?.some(follower => props.post.member.memberId === follower.followed) && (
                        <div id='followBtn'>
                            <button onClick={() => onFollow(props.post.member.memberId)}>FOLLOW</button>
                        </div>
                    )}
            </div>

            <div id='imgbox'>
                {imgList.length > 0 && (
                    <>
                        {/* ✅ 좌측 이동 버튼 */}
                        <button className="slide-btn left" onClick={prevSlide}>
                            <FaChevronLeft />
                        </button>

                        {/* ✅ 현재 표시되는 이미지 or 비디오 */}
                        {imgList.map((img, index) => {
                            const isActive = index === currentIndex; // 현재 인덱스인지 확인
                            const isImage = img.savefileName.match(/\.(jpeg|jpg|png|gif)$/i);
                            const isVideo = img.savefileName.match(/\.(mp4|webm|ogg)$/i);

                            return (
                                <div key={img.savefileName} className={`slide ${isActive ? 'active' : 'hidden'}`}>
                                    {isImage ? (
                                        <img src={`${process.env.REACT_APP_ADDRESS}/userimg/${img.savefileName}`} alt="Post" />
                                    ) : isVideo ? (
                                        <video
                                        ref={props.videoRef}
                                        controls
                                        autoPlay
                                        playsInline
                                        loop
                                        muted={props.isMuted} // ✅ 기존 음소거 상태 유지
                                        onLoadStart={(e) => {
                                            e.target.muted = props.isMuted;
                                            e.target.volume = props.volume; // ✅ 기존 볼륨 유지
                                        }}
                                        onVolumeChange={handleVolumeChange} // ✅ 볼륨 변경 감지
                                    >
                                            <source src={`${process.env.REACT_APP_ADDRESS}/userimg/${img.savefileName}`} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : null}
                                </div>
                            );
                        })}

                        {/* ✅ 우측 이동 버튼 */}
                        <button className="slide-btn right" onClick={nextSlide}>
                            <FaChevronRight />
                        </button>
                    </>
                )}
            </div>

            <div className='like'>
                {isLoadingLikes ? (
                    <LoadingSpinner />
                ) : likeList.some(like => loginUser.memberId === like.member.memberId) ? (
                    <AiFillHeart id='icons' onClick={onLike} />
                ) : (
                    <AiOutlineHeart id='icons' onClick={onLike} />
                )}
                &nbsp;&nbsp;
                <BiSolidMessageSquareDetail id='icons' onClick={toggleReplyView} />
                &nbsp;&nbsp;
                <span>{likeList.length > 0 ? `${likeList.length}명이 좋아합니다` : '아직 좋아요가 없어요'}</span>
            </div>

            <div className='content'>
                <pre>{props.post.content}</pre>
            </div>

            <div className='reply' style={{ display: replyView ? 'block' : 'none' }}>
                {isLoadingReplies ? (
                    <LoadingSpinner />
                ) : replyList.map(reply => (
                    <div key={reply.replyId} style={{ display: 'flex', margin: '5px 3px' }}>
                        <div style={{ flex: '1', fontWeight: 'bold' }}>{reply.member.nickname}&nbsp;</div>
                        <div style={{ flex: '5' }}>{reply.content}</div>
                        {reply.member.memberId === loginUser.memberId && (
                            <button style={{ flex: '1' }} onClick={() => deleteReply(reply.replyId)}>삭제</button>
                        )}
                    </div>
                ))}
                <div style={{ display: 'flex' }}>
                    <input type="text" style={{ flex: '5' }} value={replyContent} onChange={(e) => setReplyContent(e.currentTarget.value)} />
                    <button id='replyBtn' style={{ flex: '1' }} onClick={addReply}>작성</button>
                </div>
            </div>
        </div>
    );
};

export default Post;
