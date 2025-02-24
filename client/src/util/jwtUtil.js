import axios from "axios";
import { Cookies } from 'react-cookie'
import { setCookie , getCookie } from "./cookieUtil";
const jaxios = axios.create();
const cookies = new Cookies();

const beforeReq=async (config)=>{   
    console.log("jaxios1")
    
    let currentUser = getCookie('user');

    console.log("jaxios2")

    console.log("currentUser"+currentUser)
    
    console.log("currentUser.accessToken1 :"+currentUser.accessToken)

    console.log("jaxios3")

    console.log("currentUser.refreshToken1 :"+currentUser.refreshToken)

    const Header = { headers:{'Authorization' : `Bearer ${currentUser.accessToken}` } }

    const res = await axios.get(`/api/member/refresh/${currentUser.refreshToken}`, Header )

    // console.log("currentUser.accessToken2 :"+currentUser.accessToken)
    // console.log("currentUser.refreshToken2 :"+currentUser.refreshToken)
    
    currentUser.accessToken = res.data.accessToken;

    currentUser.refreshToken = res.data.refreshToken;

    setCookie('user', JSON.stringify(currentUser))

    const { accessToken } = currentUser;

    config.headers.Authorization = `Bearer ${accessToken}`

    return config;
}
const requestFail=(err)=>{ }
const beforeRes=async (res)=>{ return res }
const responseFail=(err)=>{ }

jaxios.interceptors.request.use( beforeReq, requestFail );
jaxios.interceptors.response.use( beforeRes, responseFail)

export default jaxios;