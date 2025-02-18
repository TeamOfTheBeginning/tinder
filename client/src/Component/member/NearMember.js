import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const NearMember = () => {
    const location = useLocation();
    const loginUser = location.state?.loginUser; // 옵셔널 체이닝 사용
    const [nearbyMembers, setNearbyMembers] = useState([]);
    const [maxDistance, setMaxDistance] = useState(1000);
    const [searchDistance, setSearchDistance] = useState(1000); // 검색할 거리를 저장하는 상태

    const handleSearch = async () => {
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

    return (
        <div>
            <h2>주변 이성 회원</h2>
            <label>
                최대 거리 (km):
                <input
                    type="number"
                    value={searchDistance} // 현재 검색 거리 값
                    onChange={(e) => setSearchDistance(parseInt(e.target.value, 10))} // 검색 거리 업데이트
                />
            </label>
            <button onClick={handleSearch}>검색</button> {/* 검색 버튼 */}
            <ul>
                {nearbyMembers.map(member => (
                    <li key={member.id}>{member.nickname}</li>
                ))}
            </ul>
        </div>
    );
};

export default NearMember;
