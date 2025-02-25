import { Cookies } from 'react-cookie';
const cookies = new Cookies();

// UTF-8 문자열을 Base64로 인코딩하는 함수
const encodeBase64 = (str) => {
    return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
};

// Base64를 UTF-8 문자열로 디코딩하는 함수
const decodeBase64 = (str) => {
    return new TextDecoder().decode(Uint8Array.from(atob(str), c => c.charCodeAt(0)));
};

// 쿠키에 데이터 나눠서 저장
export const setCookie1 = (name, value, days = 1) => {
    const expires = new Date();
    expires.setUTCDate(expires.getUTCDate() + days);

    // JSON 문자열로 변환 후 Base64 인코딩
    const jsonString = encodeBase64(JSON.stringify(value));

    // 4KB 제한을 고려하여 나누기 (쿠키 1개당 3000바이트 이하)
    const chunkSize = 3000; 
    const chunkCount = Math.ceil(jsonString.length / chunkSize);

    for (let i = 0; i < chunkCount; i++) {
        const chunk = jsonString.slice(i * chunkSize, (i + 1) * chunkSize);
        cookies.set(`${name}_${i}`, chunk, { path: '/', expires });
    }

    // 전체 조각 개수를 저장하는 메타 데이터 쿠키
    cookies.set(`${name}_count`, chunkCount, { path: '/', expires });
};

// 쿠키에서 데이터 불러오기 (합치기)
export const getCookie1 = (name) => {
    const chunkCount = parseInt(cookies.get(`${name}_count`), 10);
    if (!chunkCount) return null;

    let jsonString = '';
    for (let i = 0; i < chunkCount; i++) {
        const chunk = cookies.get(`${name}_${i}`);
        if (!chunk) return null; // 일부 조각이 없으면 오류 방지
        jsonString += chunk;
    }

    try {
        return JSON.parse(decodeBase64(jsonString)); // Base64 디코딩 후 JSON 파싱
    } catch (error) {
        console.error('Error parsing cookie data:', error);
        return null;
    }
};

// 쿠키 삭제
export const removeCookie1 = (name, path = "/") => {
    const chunkCount = parseInt(cookies.get(`${name}_count`), 10);
    if (chunkCount) {
        for (let i = 0; i < chunkCount; i++) {
            cookies.remove(`${name}_${i}`, { path });
        }
        cookies.remove(`${name}_count`, { path });
    }
};
