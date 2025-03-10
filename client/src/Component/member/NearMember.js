import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

import '../../style/nearmember.css';

import jaxios from '../../util/jwtUtil';

const NearMember = () => {
    const loginUser = useSelector(state => state.user);
    const [nearbyMembers, setNearbyMembers] = useState([]);
    const [searchDistance, setSearchDistance] = useState(1000); // 검색할 거리를 저장하는 상태

    const handleSearch = async () => {
        ;
        // console.log(loginUser);
        // loginUser가 null 또는 undefined인 경우 처리
        if (!loginUser || !loginUser.latitude || !loginUser.longitude) {
            console.warn("loginUser 정보가 유효하지 않습니다.");
            return;
        }

        // console.log('fetchNearbyMembers 실행');
        // console.log('loginUser:', loginUser);
        try {
            const response = await jaxios.get('/api/member/nearby', {
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

    const haversine = (lat1, lon1) => {
        var lat2 = loginUser.latitude
        var lon2 = loginUser.longitude
    
    
        const R = 6371; // 지구 반지름 (단위: km)
        
        // 위도 및 경도를 라디안으로 변환
        const toRadians = (degree) => (degree * Math.PI) / 180;
        const phi1 = toRadians(lat1);
        const phi2 = toRadians(lat2);
        const deltaPhi = toRadians(lat2 - lat1);
        const deltaLambda = toRadians(lon2 - lon1);
    
        // Haversine 공식 적용
        const a = Math.sin(deltaPhi / 2) ** 2 + 
                  Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        return (R * c).toFixed(1); // 거리 (단위: km)
    };

    async function like(memberId){

        await jaxios.post(`/api/member2/insertMemberLike`,{liker:loginUser.memberId , memberId })
        .then((result)=>{
            // console.log("result.data.msg"+result.data.msg)
    
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
                    <span>최대 거리</span>
                    <input
                        type="number"
                        value={searchDistance}
                        onChange={(e) => setSearchDistance(parseInt(e.target.value, 10))}
                    /><span>(km)</span>
                </label>
                <div className='btns'>
                    <button onClick={handleSearch}>검색</button>
                </div>
            </div>
            <ul className="member-list">
                {nearbyMembers.map(member => (
                    <li key={member.memberId} className="member-item">
                        <div className="member-avatar">
                        <img src={`${process.env.REACT_APP_ADDRESS2}/userimg/${member.profileImg}`} /></div>
                        <div className="member-info">
                            <div className='member-name'>{member.nickname}</div>
                            <div className='member-distance'>{haversine(member.latitude,member.longitude) }km</div>
                            <div className='nearMemberBtns'>
                                <div className='btns'>
                                <button className='nearMemberBtn' onClick={()=>like(member.memberId)}>좋아요</button>
                                </div>
                            </div>
                        </div>
                        
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NearMember;
