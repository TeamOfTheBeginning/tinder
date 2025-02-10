import React, {useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";

import MainMenu from '../MainMenu';
import '../../style/writePost.css'

import { useSelector } from 'react-redux';

const WritePost = () => {

    const loginUser = useSelector( state=>state.user );
    const [imgList, setIimgList] = useState([]);
    const [content, setContent] = useState('');
    const navigate=useNavigate();
    const [word, setWord] = useState('n')
    
    const [divStyle2, setDivStyle2] = useState({display:'none'})
    const [divStyle3, setDivStyle3] = useState({display:'none'})
    const [divStyle4, setDivStyle4] = useState({display:'none'})
    const [divStyle5, setDivStyle5] = useState({display:'none'})
    const [divStyle6, setDivStyle6] = useState({display:'none'})
    const [divStyle7, setDivStyle7] = useState({display:'none'})
    const [divStyle8, setDivStyle8] = useState({display:'none'})
    const [divStyle9, setDivStyle9] = useState({display:'none'})
    const [divStyle10, setDivStyle10] = useState({display:'none'})

    const [ imgSrc1, setImgsrc1 ] = useState('');
    const [ imgSrc2, setImgsrc2 ] = useState('');
    const [ imgSrc3, setImgsrc3 ] = useState('');
    const [ imgSrc4, setImgsrc4 ] = useState('');
    const [ imgSrc5, setImgsrc5 ] = useState('');
    const [ imgSrc6, setImgsrc6 ] = useState('');
    const [ imgSrc7, setImgsrc7 ] = useState('');
    const [ imgSrc8, setImgsrc8 ] = useState('');
    const [ imgSrc9, setImgsrc9 ] = useState('');
    const [ imgSrc10, setImgsrc10 ] = useState('');

    const fieldStyle={
        width:"100%", 
        display: "flex",
        flexDirection:"row",
        margin:"5px 0",
        justifyContent: "space-between",
        border:"1px solid black",
    }

    async function imgUpload(e, n){

        if( !e.target.value ){ return }
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        const result = await axios.post('/api/post/fileupload', formData);

        if( n == 1){
            setDivStyle2( fieldStyle );
            setImgsrc1( `http://localhost:8070/images/${result.data.filename}`);
        }else if( n == 2){
            setDivStyle3( fieldStyle );
            setImgsrc2( `http://localhost:8070/images/${result.data.filename}`);
        }else if( n == 3){
            setDivStyle4( fieldStyle );
            setImgsrc3( `http://localhost:8070/images/${result.data.filename}`);
        }else if( n == 4){
            setDivStyle5( fieldStyle );
            setImgsrc4( `http://localhost:8070/images/${result.data.filename}`);
        }else if( n == 5){
            setDivStyle6( fieldStyle );
            setImgsrc5( `http://localhost:8070/images/${result.data.filename}`);
        }else if( n == 6){
            setDivStyle7( fieldStyle );
            setImgsrc6( `http://localhost:8070/images/${result.data.filename}`);
        }else if( n == 7){
            setDivStyle8( fieldStyle );
            setImgsrc7( `http://localhost:8070/images/${result.data.filename}`);
        }else if( n == 8){
            setDivStyle9( fieldStyle );
            setImgsrc8( `http://localhost:8070/images/${result.data.filename}`);
        }else if( n == 9){
            setDivStyle10( fieldStyle );
            setImgsrc9( `http://localhost:8070/images/${result.data.filename}`);
        }else if( n == 10){
            setImgsrc10( `http://localhost:8070/images/${result.data.filename}`);
        }

        let arr = [...imgList];
        arr.push(result.data.filename);
        setIimgList( [...arr] );

        console.log(imgList);
    }

    async function onSubmit(){
        let result = await axios.post('/api/post/writePost', {content, writer:loginUser.id})
        const postid = result.data.postid;

        // id하고 이미지 리스트의 이미지이름들로 images 테이블에 이미지 갯수만큼 레코드를 추가
        for(let i=0; i<imgList.length; i++){
            await axios.post('/api/post/writeimages', {postid, savefilename:imgList[i]})
        }
        navigate('/main');
    }

    return (
        <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
            <MainMenu  setWord={setWord}/>
            <div className='postWrite'>
                <div className='title' style={{fontFamily:"Dancing Script" , fontSize:"150%"}}>POST WRITE FORM</div>
                <div className='field'>
                    <label>content</label>
                    <textarea rows="7" value={content} onChange={(e)=>{setContent(e.currentTarget.value)}}></textarea>
                </div>

                <div className='field' id='img1' style={fieldStyle} >
                    <input type="file" onChange={(e)=>{ imgUpload(e, 1)}}/>
                    <img src={imgSrc1} height="50"/>
                </div>
                

                <div className='field'  id='img2' style={divStyle2}>
                    <input type="file" onChange={(e)=>{ imgUpload(e, 2)}} />
                    <img src={imgSrc2} height="50"/>
                </div>
                

                <div className='field'  id='img3' style={divStyle3}>
                    <input type="file"  onChange={(e)=>{ imgUpload(e, 3)}}/>
                    <img src={imgSrc3} height="50" />
                </div>
                

                <div className='field'  id='img4' style={divStyle4}>
                    <input type="file"  onChange={(e)=>{ imgUpload(e, 4)}}/>
                    <img src={imgSrc4} height="50"/>
                </div>
                

                <div className='field'  id='img5' style={divStyle5}>
                    <input type="file"  onChange={(e)=>{ imgUpload(e, 5)}}/>
                    <img src={imgSrc5} height="50"/>
                </div>
                

                <div className='field'  id='img6' style={divStyle6}>
                    <input type="file"  onChange={(e)=>{ imgUpload(e, 6)}}/>
                    <img src={imgSrc6} height="50"/>
                </div>
                

                <div className='field'  id='img7' style={divStyle7}>
                    <input type="file"  onChange={(e)=>{ imgUpload(e, 7)}}/>
                    <img src={imgSrc7} height="50"/>
                </div>
                

                <div className='field'  id='img8' style={divStyle8}>
                    <input type="file"  onChange={(e)=>{ imgUpload(e, 8)}}/>
                    <img src={imgSrc8} height="50"/>
                </div>
                

                <div className='field'  id='img9' style={divStyle9}>
                    <input type="file"  onChange={(e)=>{ imgUpload(e, 9)}}/>
                    <img src={imgSrc9} height="50"/>
                </div>
                

                <div className='field'  id='img10' style={divStyle10}>
                    <input type="file"  onChange={(e)=>{ imgUpload(e, 10)}}/>
                    <img src={imgSrc10} height="50"/>
                </div>
                
                <div className='btns'>
                    <button onClick={ ()=>{ onSubmit() } }>작성완료</button>
                    <button onClick={ ()=>{ navigate('/main') } }>Main으로</button>
                </div>

            </div>
        </div>
    )
}

export default WritePost
