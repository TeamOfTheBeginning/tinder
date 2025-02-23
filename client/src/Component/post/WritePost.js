
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../SideBar";
import "../../style/sidebar.css";
import "../../style/posts.css";
import "../../style/writePost.css";
import { useSelector } from "react-redux";

const WritePost = ({ closeSideViewer }) => {
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
        newImgSrcs[index] = `http://localhost:8070/userimg/${result.data.filename}`;
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

    if (imgList.length === 0) {
      alert("사진을 최소 1장 이상 첨부해주세요.");
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

      if(result.data.msg=="ok"){
        alert("작성이 완료되었습니다.")
        // 게시글 작성 완료 후 SideViewer 닫기
        closeSideViewer();

        // 메인 페이지로 이동
        navigate("/main");
      }
      
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  }

  return (
    <div className="Container">
      <div className="Content">
        <div className="postWrite">
          <div className="title" style={{ fontSize: "150%" }}>
            {loginUser.nickname} now . . .
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
                <label for="file">
                  <div className="field">
                    파일 첨부
                    {imgSrcs[index] && <img src={imgSrcs[index]} />}
                  </div>
                </label>
                <input type="file" id="file" onChange={(e) => imgUpload(e, index)} />

                
              </div>
            ))}
            <div className="btns">
              <button type="submit">작성완료</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WritePost;
