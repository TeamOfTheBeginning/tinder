import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import '../../style/match/findliker.css';

import jaxios from '../../util/jwtUtil';

const FindLiker = () => {

    const loginUser = useSelector(state=>state.user);
    const navigate = useNavigate();
    
    const [likerList, serLikerList] = useState();

    useEffect(() => {
        console.log(loginUser)
        jaxios.get(`/api/member2/findLiker`, { params: { memberId:loginUser.memberId } })
            .then((result) => {
                console.log("result.data.likerList: " + JSON.stringify(result.data.likerList));
                serLikerList(result.data.likerList);
            })
            .catch((err) => { console.error(err); });
    }, []);

    async function like(memberId){

        await jaxios.post(`/api/member2/insertMemberLike`,{liker:loginUser.memberId , liked:memberId })
        .then((result)=>{
            console.log("result.data.msg"+result.data.msg)
    
            if(result.data.msg=='yes') {alert("좋아요가 완료되었습니다!")}
            else if(result.data.msg=='no') {alert("좋아요가 취소되었습니다!")}
            else {alert("시스템 오류!")}
        }
        ).catch((err)=>{console.error(err)})
    
    }




    return (
        <div className='findLikerContainer'>
            {
                        (likerList)?(
                            likerList.map((liker, idx)=>{
                                return (
                                    <div key={idx} className='findLikerListContainer'>
                                        <div className='findLikerLeft'>
                                            <img src={`http://localhost:8070/userimg/${liker.profileImg}`} />
                                            <br/>
                                        </div>

                                        <div className='findLikerRight'>
                                            <div className='findLikerProfile'>  
                                            {liker.nickname}
                                            ({liker.age})<br/>
                                            {liker.profileMsg}</div>
                                            <div className='findLikerBtns'>
                                            <button onClick={()=>like(liker.memberId)}>좋아요</button>
                                            {/* <button>쪽지</button> */}
                                            </div>

                                        </div>
                                        {/* {liker.memberId} */}
                                        
                                        
                                        
                                    </div>
                                )
                            })
                        ):(null)
            }
            {/* <button onClick={()=>navigate(-1)}>돌아가기</button> */}
        </div>
    )
}

export default FindLiker
