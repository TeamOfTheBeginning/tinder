import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../style/nearmember.css';
import { useSelector } from 'react-redux';


const NearMember = () => {
    const loginUser = useSelector(state => state.user);
    const [nearbyMembers, setNearbyMembers] = useState([]);
    const [searchDistance, setSearchDistance] = useState(1000); // 검색할 거리를 저장하는 상태

    const handleSearch = async () => {
        ;
        console.log(loginUser);
        // loginUser가 null 또는 undefined인 경우 처리
        if (!loginUser || !loginUser.latitude || !loginUser.longitude) {
            console.warn("loginUser 정보가 유효하지 않습니다.");
            return;
        }

        console.log('fetchNearbyMembers 실행');
        console.log('loginUser:', loginUser);
        try {
            const response = await axios.get('/api/member/nearby', {
                params: {
                    latitude: loginUser.latitude,
                    longitude: loginUser.longitude,
                    maxDistance: searchDistance, // 검색 거리 사용
                    memberId: loginUser.memberId
                }
            });
            setNearbyMembers(response.data);
        } catch (error) {
            console.error('근처 회원을 가져오는데 실패했습니다:', error);
        }
    };

    async function like(memberId){

        await axios.post(`/api/member2/insertMemberLike`,{liker:loginUser.memberId , memberId })
        .then((result)=>{
            console.log("result.data.msg"+result.data.msg)
    
            if(result.data.msg=='yes') {alert("좋아요가 완료되었습니다!")}
            else if(result.data.msg=='no') {alert("좋아요가 취소되었습니다!")}
            else {alert("시스템 오류!")}
        }
        ).catch((err)=>{console.error(err)})    
      }

    return (
        <div className="near-member-container">
            <h2>주변 이성 회원</h2>
            <div className="search-controls">
                <label>
                    최대 거리 (km):
                    <input
                        type="number"
                        value={searchDistance}
                        onChange={(e) => setSearchDistance(parseInt(e.target.value, 10))}
                    />
                </label>
                <button onClick={handleSearch}>검색</button>
            </div>
            <ul className="member-list">
                {nearbyMembers.map(member => (
                    <li key={member.memberId} className="member-item">
                        <img src={`${process.env.REACT_APP_ADDRESS2}/userimg/${member.profileImg}`} className="member-avatar" />
                        <div className="member-info">
                            <div className="member-name">{member.nickname}</div>
                            <div className='matchingMemberBtns'>
                                <button className='matchBtn' onClick={()=>like(member.memberId)}>좋아요</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NearMember;
