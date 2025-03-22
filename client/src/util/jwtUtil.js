import axios from "axios";
import { Cookies } from 'react-cookie'
import { setCookie , getCookie } from "./cookieUtil";
import { setCookie1 , getCookie1 } from "./cookieUtil2";
import { SiOutline } from "react-icons/si";
const jaxios = axios.create();
const cookies = new Cookies();

const beforeReq=async (config)=>{   
    // console.log("jaxios1")
    
    let currentUser = getCookie1('user');
    

    // console.log("jaxios2")

    // console.log("currentUser"+currentUser)

    let currentUser2 = JSON.parse(currentUser)

    // console.log(currentUser);  // 객체 전체 출력
    
    // console.log("currentUser.accessToken :"+currentUser2.accessToken)

    // console.log("jaxios3")

    // console.log("currentUser.refreshToken :"+currentUser2.refreshToken)

    const Header = { headers:{'Authorization' : `Bearer ${currentUser2.accessToken}` } }

    const res = await axios.get(`/api/member/refresh/${currentUser2.refreshToken}`, Header )

    // console.log("currentUser.accessToken2 :"+currentUser.accessToken)
    // console.log("currentUser.refreshToken2 :"+currentUser.refreshToken)

    // console.log("res.date"+res.data)
    // console.log("res.date"+JSON.stringify(res.data))
    // console.log("res.data.accessToken"+JSON.stringify(res.data.accessToken))
    
    currentUser2.accessToken = res.data.accessToken;

    // console.log("currentUser.accessToken3"+currentUser2.accessToken)    

    currentUser2.refreshToken = res.data.refreshToken;

    // console.log("currentUser.refreshToken3"+currentUser2.refreshToken)

    // setCookie1('user', JSON.stringify(currentUser))
    setCookie1('user', JSON.stringify(currentUser2) , 1)

    const { accessToken } = currentUser2;

    // console.log("accessToken"+accessToken)

    config.headers.Authorization = `Bearer ${accessToken}`

    return config;
}
const requestFail=(err)=>{ }
const beforeRes=async (res)=>{ return res }
const responseFail=(err)=>{ }

jaxios.interceptors.request.use( beforeReq, requestFail );
jaxios.interceptors.response.use( beforeRes, responseFail)

export default jaxios;