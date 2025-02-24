// cookieUtil.js
import {Cookies} from 'react-cookie'
const cookies = new Cookies()

// 리액트에서 사용하던 정보를 쿠키에 저장할때 호출할 함수 생성
export const setCookie=(name, value, days=1)=>{
    
    const expires = new Date()
    expires.setUTCDate(expires.getUTCDate() + days ) //보관기한
    return cookies.set(name, value, {path:'/', })
}
// ('user' , result.data.loginUser, 1)

export const getCookie = (name) => {
    return cookies.get(name)
}
// const loginUser = getCookie( 'user' )

export const removeCookie = (name , path="/") => {
    cookies.remove(name, {path} )
}
// cookies.remove('user')