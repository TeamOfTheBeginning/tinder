import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

import '../../style/message/chatroomfromrandom.css';

import jaxios from '../../util/jwtUtil';


const ChatRoomFromRandom = () => {

    const { chatGroupId } = useParams();
    
    const navigate = useNavigate();
    const loginUser = useSelector(state=>state.user);

    const [chatList, setChatList] = useState();
    const [quizList, setQuizList] = useState();
    const [chatGroupQuizList, setChatGroupQuizList] = useState();
    const [visibleQuizzes, setVisibleQuizzes] = useState([]);

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [waiting, setWaiting] = useState(false);
    const [chatWaiting, setChatWaiting] = useState(false);
    const [tempWaiting, setTempWaiting] = useState(false);
    
    const [message, setMessage] = useState();
    // const [message2, setMessage2] = useState();


    const handleInputChange = (e) => {
        setMessage(e.target.value); // 사용자 입력을 상태에 저장
    };

    useEffect(() => {
        const fetchChatList = () => {
            jaxios.get(`/api/chat/getChatList1`, { params: { chatGroupId } })
                .then((result) => {
                    if (JSON.stringify(chatList) !== JSON.stringify(result.data.chatList)) {
                        setChatList(result.data.chatList);
                    }
                })
                .catch((err) => { console.error(err); });
        };
    
        fetchChatList();
        const interval = setInterval(fetchChatList, 60000);
    
        return () => clearInterval(interval);
    }, [chatGroupId, chatList]);
    

    useEffect(() => {
        jaxios.get(`/api/quiz/getQuizList`, { params: { chatGroupId } })
            .then((result) => {
                console.log("result.data" + result.data.chatGroupQuizList);
                setChatGroupQuizList(result.data.chatGroupQuizList);
                scheduleQuizzes(result.data.chatGroupQuizList); // 여기에 추가
            })
            .catch((err) => { console.error(err); });
    }, [chatGroupId]);

    const scheduleQuizzes = (quizzes) => {
        const now = Date.now();
        quizzes.forEach((quiz) => {
            const transmissionTime = new Date(quiz.transmissionTime).getTime(); // 전송 시간을 밀리초로 변환
            const delay = transmissionTime - now; // 현재 시간과 전송 시간의 차이 계산
            
            if (delay > 0) {
                setTimeout(() => {
                    setVisibleQuizzes((prev) => [...prev, quiz]);
                    setChatWaiting(true);
                }, delay);
            } else {
                setVisibleQuizzes((prev) => [...prev, quiz]);
            }
        });
    };

    

    const formatDate = (dateString) => {
        const date = new Date(dateString); // ISO 8601 형식의 문자열을 Date 객체로 변환
    
        const day = String(date.getDate()).padStart(2, '0'); // 일 (2자리로 맞추기)
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1)
        const year = String(date.getFullYear()).slice(-2); // 년 (끝 두 자리만 사용)
        
        const hours = String(date.getHours()).padStart(2, '0'); // 시간
        const minutes = String(date.getMinutes()).padStart(2, '0'); // 분
        
        return `${year}/${month}/${day} ${hours}:${minutes}`;
        }

    async function sendMessage() {
        if (chatWaiting) return;

        try {
            const response = await jaxios.post(`/api/chat/sendMessageInAnonymityRoom`, null, {
                params: { content: message, chatGroupId, sender: loginUser.memberId }
            });

            
    
            if (response.data.expired) {
                alert("이 채팅방은 1시간이 지나 만료되었습니다. 메시지를 보낼 수 없습니다.");
                return;
            }
    
            if (response.data.blocked) {
                alert("메시지를 보낼 수 없습니다. 차단한 사용자 또는 차단된 사용자와의 대화입니다.");
                return;
            }

            if (response.data.deactivated) {
                alert("이 채팅방은 비활성화 되었습니다. 메시지를 보낼 수 없습니다.");
                return;
            }
    
            setChatList(response.data.chatList);
        } catch (error) {
            console.error(error);
        }
    }

    async function setTempUp(){
        if (tempWaiting) return;

        jaxios.post(`/api/member2/setTempUp`, null ,{ params: { chatGroupId,memberId:loginUser.memberId } })
        .then((result) => {
            if(result.data.msg=='yes'){
                alert("상대 온도가 상승되었습니다.")
                setTempWaiting(true);
            }                
            else{ alert("오류발생") }            
        })
        .catch((err) => { console.error(err); });
    }

    async function setTempDownAndBlock(){
        if (tempWaiting) return;

        if(window.confirm("상대방을 차단합니다.")){
            jaxios.post(`/api/member2/setTempDown`, null ,{ params: { chatGroupId,memberId:loginUser.memberId } })
            .then((result) => {
                if(result.data.msg=='yes'){
                    alert("상대 온도가 하락 되었습니다.")
                    setTempWaiting(true);
                }
                else{ alert("오류발생") }   
            })
            .catch((err) => { console.error(err); });            

            jaxios.post(`/api/member2/addBlockedFromRandomChat`, null ,{ params: { chatGroupId,memberId:loginUser.memberId } })
            .then((result) => {
                if(result.data.msg=='yes')
                    alert("상대가 차단 되었습니다.")
                else{ alert("오류발생") }   
            })
            .catch((err) => { console.error(err); });

        }        
    }

    const selectAnswer = (chatGroupQuizId,answer) => {
        if (waiting) return; // 이미 선택했다면 중복 선택 방지
        // setSelectedAnswer(answer);
        setWaiting(true);

        jaxios.post(`/api/quiz/submitAnswer`,null ,{ params:{chatGroupQuizId, memberId:loginUser.memberId,answer}})
        .then((res) => {
            if(res.data.result==="yes"){
                alert("선택완료")



                  // 10초 후 상대방 답변 확인
            setTimeout(() => {
                jaxios.post(`/api/quiz/guessTheAnswer`, null, { 
                    params: { chatGroupQuizId, memberId: loginUser.memberId, answer } 
                })
                .then((res) => {
                    if (res.data.result === "CONTINUE") {
                        alert("모두 같은 답을 선택했어요! 계속 대화하세요.");
                        setWaiting(false);
                        setChatWaiting(false);
                    } else {
                        alert("의견이 갈렸습니다! 대화방이 종료됩니다.");
                        
                        
                        jaxios.post(`/api/chat/setChatRoomDeactivated`, null, { 
                            params: { chatGroupId } 
                        })
                        .then((res) => {
                            if (res.data.result === "yes") {
                                alert("채팅방이 종료됩니다.");
                            } else {
                                alert("오류발생.");
                            }
                        })
                        .catch((err) => console.error(err));




                    }
                })
                .catch((err) => console.error(err));
            }, 10000); // 10초(10000ms) 대기 후 실행







            }else{
                alert("이미 선택했습니다.")
            }            
        })
        .catch((err) => console.error(err));       

    };

    function ei(ei){
        if(ei==0){return "E"}
        else{return "I"};
    }

    function ns(ns){
        if(ns==0){return "N"}
        else{return "S"};
    }

    function tf(tf){
        if(tf==0){return "T"}
        else{return "F"};
    }

    function jp(jp){
        if(jp==0){return "J"}
        else{return "P"};
    }


    return (
        <div className='chatRoomFromRandomContainer'>
        <div className='chatRoomFromRandomContents'>
        {
            (chatList)?(
                chatList.map((chat, idx)=>{

                    const isOwnMessage = String(chat.sender.memberId) === String(loginUser.memberId);
                    console.log("chat.sender.memberId"+chat.sender.memberId+"loginUser.memberId"+loginUser.memberId)
                    console.log("isOwnMessage"+isOwnMessage)

                    return (
                        <div key={idx} className={`chat ${isOwnMessage ? 'myChat' : ''}`}>
                            <div className='chatImg'>
                            {ei(chat.sender.memberInfo.ei)}
                            {ns(chat.sender.memberInfo.ns)}
                            {tf(chat.sender.memberInfo.tf)}
                            {jp(chat.sender.memberInfo.jp)}
                                
                            </div>
                            <div className='chatContainer'>
                                <div className='chatContent'>
                                    &nbsp; {formatDate(chat.createdDate)}&nbsp;<br/>{chat.content} &nbsp; 
                                </div>
                            </div>
                        </div>
                    )
                })
            ):("Loading...")
        }
        </div>

        <div>
        {visibleQuizzes.length > 0 ? (
                visibleQuizzes.map((quiz, idx) => (
                    <div key={idx} className="quizContainer">
                        <div className="quizContent">
                        {/* {quiz.chatGroupQuizId} */}
                        {quiz.quiz.content} &nbsp;
                        </div>
                        <div className="quizAnswers">
                            <button onClick={() => selectAnswer(quiz.chatGroupQuizId,1)}>1</button>
                            <button onClick={() => selectAnswer(quiz.chatGroupQuizId,2)}>2</button>
                        </div>
                    </div>
                ))
            ) : (
                "Quiz Loading..."
            )}
        </div>

        <div className='chatRoomInput'>
            <input type='text'
                placeholder='텍스트를 입력하세요'
                onChange={handleInputChange}
                value={message}
            /> <button onClick={()=>sendMessage()}>보내기</button>
        </div>

        <div className='chatRoomEvaluateTemp'>
            <div>
                <button onClick={()=>setTempUp()}>좋아요</button>
                <button onClick={()=>setTempDownAndBlock()}>차단</button>
            </div>
        </div>
      
    </div>
    )
}

export default ChatRoomFromRandom
