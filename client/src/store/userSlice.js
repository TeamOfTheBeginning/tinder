// userSlice.js
import { createSlice } from '@reduxjs/toolkit'
import {Cookies} from 'react-cookie'
const cookies = new Cookies()

const initialState={
    memberId:'',
    nickname:'',
    age:'',
    email:'',
    phone:'',
    gender:'',
    birthDate:'',
    address:'',
    provider:'',
    profileImg:'',
    profileMsg:'',
    snsid:'',
    zipnum:'',
    follower:[],
    followed:[], 
}


const getLoginUser=()=>{
    const memberinfo = cookies.get('user')
    
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
        memberinfo.snsid = decodeURIComponent( memberinfo.snsid )
        memberinfo.zipnum = decodeURIComponent( memberinfo.zipnum )
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
                state.snsid = action.payload.snsid;
                state.zipnum = action.payload.zipnum;
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
                state.snsid = '';
                state.zipnum = '';
                state.follower = [];
                state.followed = [];
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
