import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import '../../style/match/match.css';

import jaxios from '../../util/jwtUtil';

const FindLiker = () => {

    const loginUser = useSelector(state=>state.user);
    const navigate = useNavigate();
    
    const [likerList, serLikerList] = useState();

    useEffect(() => {
        console.log(loginUser)
        jaxios.get(`/api/member2/findLiker`, { params: { memberId:loginUser.memberId } })
            .then((result) => {
                // console.log("result.data.likerList: " + JSON.stringify(result.data.likerList));
                serLikerList(result.data.likerList);
            })
            .catch((err) => { console.error(err); });
    }, []);

    async function like(memberId){

        await jaxios.post(`/api/member2/insertMemberLike`,{liker:loginUser.memberId , liked:memberId })
        .then((result)=>{
            // console.log("result.data.msg"+result.data.msg)
    
            if(result.data.msg=='yes') {alert("좋아요가 완료되었습니다!")}
            else if(result.data.msg=='no') {alert("좋아요가 취소되었습니다!")}
            else {alert("시스템 오류!")}
        }
        ).catch((err)=>{console.error(err)})
    
    }




    return (
        <div className='LikerContainer'>
            {
                (likerList)?(
                    likerList.map((liker, idx)=>{
                        return (
                            <div key={idx} className='MemberListContainer'>
                                <div className='memberImgBox'>
                                    <img src={`${process.env.REACT_APP_ADDRESS}/userimg/${liker.profileImg}`} />
                                    <br/>
                                </div>

                                <div className='memberInfo'>
                                    <div className='memberProfileBox'>  
                                        <div className='nickname'>{liker.nickname}({liker.age})</div>
                                        <div className='intro'>{liker.profileMsg}</div>
                                        <div className='btns'>
                                            <button onClick={()=>like(liker.memberId)}>좋아요</button>
                                        </div>
                                    </div>

                                    
                                </div>            
                            </div>
                        )
                    })
                ):(null)
            }
        </div>
    )
}

export default FindLiker
