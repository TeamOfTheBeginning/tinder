// userSlice.js
import { createSlice } from '@reduxjs/toolkit'
import {Cookies} from 'react-cookie'
import { setCookie1 , getCookie1 } from "../util/cookieUtil2";
const cookies = new Cookies()

const initialState={
    memberId:'',
    nickname:'',
    age:'',
    email:'',
    phone:'',
    gender:'',
    birthDate:'',

    zipnum:'',
    address:'',
    latitude:'',
    longitude:'',

    provider:'',
    profileImg:'',
    profileMsg:'',
    snsId:'',
    
    account:'',
    temp:'',

    memberRoleList:[],

    memberInfo:{},
    opponentMemberInfo:{},
    follower:[],
    followed:[],

    accessToken:'',
    refreshToken:'',
}


const getLoginUser=()=>{
    const memberinfoStr = getCookie1('user'); // 문자열로 가져옴
// console.log("memberinfoStr: " + memberinfoStr);

let memberinfo;
if (memberinfoStr) {
    try {
        memberinfo = JSON.parse(memberinfoStr); // JSON 객체로 변환
        // console.log("memberId:", memberinfo?.memberId);
        // console.log("nickname:", memberinfo?.nickname);
        // console.log("email:", memberinfo?.email);
        // console.log("hobbies:", memberinfo?.memberInfo.hobbies)
    } catch (error) {
        console.error("JSON parsing error: ", error);
        memberinfo = null; // 변환 실패 시 null 처리
    }
}
    
    if( memberinfo && memberinfo.email ){
        memberinfo.memberId = decodeURIComponent( memberinfo.memberId )
        memberinfo.nickname = decodeURIComponent( memberinfo.nickname )
        memberinfo.age = decodeURIComponent( memberinfo.age )
        memberinfo.email = decodeURIComponent( memberinfo.email )
        memberinfo.birthDate = decodeURIComponent( memberinfo.birthDate )
        memberinfo.phone = decodeURIComponent( memberinfo.phone )
        memberinfo.gender = decodeURIComponent( memberinfo.gender )
        memberinfo.address = decodeURIComponent( memberinfo.address )
        memberinfo.provider = decodeURIComponent( memberinfo.provider )
        memberinfo.profileImg = decodeURIComponent( memberinfo.profileImg )
        memberinfo.profileMsg = decodeURIComponent( memberinfo.profileMsg )        
        memberinfo.snsId = decodeURIComponent( memberinfo.snsId )
        memberinfo.zipnum = decodeURIComponent( memberinfo.zipnum )
        memberinfo.latitude = decodeURIComponent( memberinfo.latitude )
        memberinfo.longitude = decodeURIComponent( memberinfo.longitude )
        memberinfo.account = decodeURIComponent( memberinfo.account )
        memberinfo.temp = decodeURIComponent( memberinfo.temp )

        memberinfo.memberRoleList = memberinfo.memberRoleList;
        // console.log(typeof memberinfo.memberInfo); 
        // console.log(memberinfo.memberInfo);


        memberinfo.memberInfo = memberinfo.memberInfo;
        memberinfo.opponentMemberInfo = memberinfo.opponentMemberInfo

        memberinfo.accessToken = decodeURIComponent( memberinfo.accessToken )
        memberinfo.refreshToken = decodeURIComponent( memberinfo.refreshToken )
    }
    return memberinfo
}

export const userSlice=createSlice(
    {
        name:'user',
        initialState : getLoginUser()  || initialState,
        reducers:{
            loginAction:(state, action)=>{
                state.memberId = action.payload.memberId;
                state.nickname = action.payload.nickname;
                state.age = action.payload.age;
                state.email = action.payload.email;
                state.birthDate = action.payload.birthDate;
                state.phone = action.payload.phone;
                state.gender = action.payload.gender;
                state.address = action.payload.address;
                state.provider = action.payload.provider;
                state.profileImg = action.payload.profileImg;
                state.profileMsg = action.payload.profileMsg;
                state.snsId = action.payload.snsId;
                state.zipnum = action.payload.zipnum;
                state.latitude = action.payload.latitude;
                state.longitude = action.payload.longitude;
                state.account = action.payload.account;
                state.temp = action.payload.temp;
                state.memberRoleList = action.payload.memberRoleList;
                state.memberInfo = action.payload.memberInfo;
                state.opponentMemberInfo = action.payload.opponentMemberInfo;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
            },
            logoutAction:(state)=>{
                state.memberId = '';
                state.nickname = '';
                state.age = '';
                state.email = '';
                state.phone = '';
                state.gender = '';
                state.address = '';
                state.birthDate = '';
                state.provider = '';
                state.profileImg = '';
                state.profileMsg = '';
                state.snsId = '';
                state.zipnum = '';
                state.latitude = '';
                state.longitude = '';
                state.account = '';
                state.temp = '';
                state.memberRoleList = [];
                state.memberInfo ={};
                state.opponentMemberInfo ={};
                state.follower = [];
                state.followed = [];
                state.accessToken = '';
                state.refreshToken = '';
            },
            setFollower : (state, action)=>{
                state.follower = action.payload;
            },
            setFollowed : (state, action)=>{
                state.followed = action.payload;
            },
        }
    }
)
export const { loginAction, logoutAction, setFollower, setFollowed } = userSlice.actions
export default userSlice.reducer
