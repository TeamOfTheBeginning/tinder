// userSlice.js
import { createSlice } from '@reduxjs/toolkit'
import {Cookies} from 'react-cookie'
const cookies = new Cookies()

const initialState={
    id:'',
    nickname:'',
    email:'',
    provider:'',
    profileimg:'',
    profilemsg:'',
    phone:'',
    snsid:'',
    followers:[],
    followings:[], 
}


const getLoginUser=()=>{
    const memberinfo = cookies.get('user')
    if( memberinfo && memberinfo.email ){
        memberinfo.id = decodeURIComponent( memberinfo.id )
        memberinfo.email = decodeURIComponent( memberinfo.email )
        memberinfo.nickname = decodeURIComponent( memberinfo.nickname )
        memberinfo.provider = decodeURIComponent( memberinfo.provider )
        memberinfo.profileimg = decodeURIComponent( memberinfo.profileimg )
        memberinfo.profilemsg = decodeURIComponent( memberinfo.profilemsg )
        memberinfo.phone = decodeURIComponent( memberinfo.phone )
        memberinfo.snsid = decodeURIComponent( memberinfo.snsid )
    }
    return memberinfo
}

export const userSlice=createSlice(
    {
        name:'user',
        initialState : getLoginUser()  || initialState,
        reducers:{
            loginAction:(state, action)=>{
                state.id = action.payload.id;
                state.email = action.payload.email;
                state.nickname = action.payload.nickname;
                state.phone = action.payload.phone;
                state.profilemsg = action.payload.profilemsg;
                state.profileimg = action.payload.profileimg;
                state.provider = action.payload.provider;
                state.snsid = action.payload.snsid;
            },
            logoutAction:(state)=>{
                state.id = '';
                state.email = '';
                state.nickname = '';
                state.phone = '';
                state.profilemsg = '';
                state.profileimg = '';
                state.provider = '';
                state.snsid = '';
                state.followers = [];
                state.followings = [];
            },
            setFollowings : (state, action)=>{
                state.followings = action.payload;
            },
            setFollowers : (state, action)=>{
                state.followers = action.payload;
            },
        }
    }
)
export const { loginAction, logoutAction, setFollowings, setFollowers } = userSlice.actions
export default userSlice.reducer
