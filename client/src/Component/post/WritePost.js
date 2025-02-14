// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import SideBar from "../SideBar";
// import "../../style/sidebar.css";
// import "../../style/posts.css";
// import "../../style/writePost.css";
// import { useSelector } from "react-redux";

// const WritePost = () => {
//     const loginUser = useSelector((state) => state.user);
//     const navigate = useNavigate();

//     const [imgList, setImgList] = useState([]);
//     const [content, setContent] = useState("");

//     // 10개의 이미지 상태 배열로 관리
//     const [imgSrcs, setImgSrcs] = useState(Array(10).fill(""));

//     // 이미지 업로드 함수
//     async function imgUpload(e, index) {
//         if (!e.target.files.length) return;

//         const formData = new FormData();
//         formData.append("image", e.target.files[0]);
//         const result = await axios.post("/api/post/fileupload", formData);

//         // imgSrcs 배열 업데이트
//         setImgSrcs((prevImgSrcs) => {
//             const newImgSrcs = [...prevImgSrcs];
//             newImgSrcs[index] = `http://localhost:8070/userImg/${result.data.filename}`;
//             return newImgSrcs;
//         });

//         // 이미지 리스트 업데이트
//         setImgList((prevImgList) => [...prevImgList, result.data.filename]);
//     }

//     // 게시글 작성 함수
//     async function onSubmit() {
//         const result = await axios.post("/api/post/writePost", {
//             content,
//             member: { memberId: loginUser.memberId },
//         });

//         const post_id = result.data.postid;

//         // 이미지 저장
//         await Promise.all(
//             imgList.map((filename) =>
//                 axios.post("/api/post/writeImages", {
//                     postId: post_id,
//                     savefileName: filename,
//                 })
//             )
//         );

//         navigate("/main");
//     }

//     return (
//         <div className="Container">
//             <SideBar />
//             <div className="Content">
//                 <div className="postWrite">
//                     <div className="title" style={{ fontSize: "150%" }}>
//                         {loginUser.memberId} now . . .
//                     </div>
//                     <div className="field">
//                         <label style={{ display: "none" }}>content</label>
//                         <textarea
//                             rows="7"
//                             value={content}
//                             onChange={(e) => setContent(e.target.value)}
//                         ></textarea>
//                     </div>

//                     {/* 파일 업로드 필드 10개 생성 */}
//                     {Array.from({ length: 10 }).map((_, index) => (
//                         <div
//                             key={index}
//                             className="field"
//                             style={{ display: index === 0 || (index < imgList.length + 1) ? "flex" : "none" }}
//                         >
//                             <input type="file" onChange={(e) => imgUpload(e, index)} />
//                             {imgSrcs[index] && <img src={imgSrcs[index]} height="50" />}
//                         </div>
//                     ))}

//                     <div className="btns">
//                         <button onClick={onSubmit}>작성완료</button>
//                         <button onClick={() => navigate("/main")}>Main으로</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default WritePost;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../SideBar";
import "../../style/sidebar.css";
import "../../style/posts.css";
import "../../style/writePost.css";
import { useSelector } from "react-redux";

const WritePost = () => {
  const loginUser = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [imgList, setImgList] = useState([]);
  const [content, setContent] = useState("");
  const [imgSrcs, setImgSrcs] = useState(Array(10).fill(""));

  // 이미지 업로드 함수
  async function imgUpload(e, index) {
    if (!e.target.files.length) return;

    try {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      const result = await axios.post("/api/post/fileupload", formData);

      setImgSrcs((prevImgSrcs) => {
        const newImgSrcs = [...prevImgSrcs];
        newImgSrcs[index] = `http://localhost:8070/userImg/${result.data.filename}`;
        return newImgSrcs;
      });

      setImgList((prevImgList) => [...prevImgList, result.data.filename]);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  // 게시글 작성 함수
  async function onSubmit(event) {
    event.preventDefault(); // 기본 동작 방지

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const result = await axios.post("/api/post/writePost", {
        content,
        member: { memberId: loginUser.memberId },
      });

      const post_id = result.data.postid;

      await Promise.all(
        imgList.map((filename) =>
          axios.post("/api/post/writeImages", {
            postId: post_id,
            savefileName: filename,
          })
        )
      );

      navigate("/main");
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  }

  return (
    <div className="Container">
      <SideBar />
      <div className="Content">
        <div className="postWrite">
          <div className="title" style={{ fontSize: "150%" }}>
            {loginUser.memberId} now . . .
          </div>
          <form onSubmit={onSubmit}>
            <div className="field">
              <label style={{ display: "none" }}>content</label>
              <textarea
                rows="7"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>

            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="field"
                style={{
                  display:
                    index === 0 || index < imgList.length + 1 ? "flex" : "none",
                }}
              >
                <input type="file" onChange={(e) => imgUpload(e, index)} />
                {imgSrcs[index] && <img src={imgSrcs[index]} height="50" />}
              </div>
            ))}

            <div className="btns">
              <button type="submit">작성완료</button>
              {/* <button type="button" onClick={() => navigate("/main")}>
                Main으로
              </button> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WritePost;
