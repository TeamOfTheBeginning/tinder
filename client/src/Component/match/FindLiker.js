import React, {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const FindLiker = () => {

    const loginUser = useSelector(state=>state.user);
    const navigate = useNavigate();
    const [likerList, serLikerList] = useState();

    useEffect(() => {
        console.log(loginUser)
        axios.get(`/api/member2/findLiker`, { params: { memberId:loginUser.memberId } })
            .then((result) => {
                console.log("result.data.likerList: " + JSON.stringify(result.data.likerList));
                serLikerList(result.data.likerList);
            })
            .catch((err) => { console.error(err); });
    }, []);




    return (
        <div>
            {
                        (likerList)?(
                            likerList.map((liker, idx)=>{
                                return (
                                    <div key={idx}>
                                        {/* {liker.memberId} */}
                                        {liker.nickname}
                                        {liker.age}<br/>
                                        {liker.profileMsg}
                                        <img src={`http://localhost:8070/userImg/${liker.profileImg}`} />
                                        <br/>
                                        <button>쪽지</button>
                                        <button onClick={()=>navigate(-1)}>돌아가기</button>
                                    </div>
                                )
                            })
                        ):(null)
            }
        
        </div>
    )
}

export default FindLiker
