import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/sidebar.css";
import "../../style/posts.css";
import "../../style/writePost.css";
import { useSelector } from "react-redux";
import jaxios from '../../util/jwtUtil';

const WritePost = ({ closeSideViewer }) => {
  const loginUser = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [imgList, setImgList] = useState([]);
  const [content, setContent] = useState("");
  const [imgSrcs, setImgSrcs] = useState(Array(10).fill(""));
  const [imgStyle, setImgStyle] = useState(Array(10).fill({ display: 'none' }));

  // 이미지 업로드 함수
  async function imgUpload(e, index) {
    if (!e.target.files.length) return;

    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const file = e.target.files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    // 파일 확장자 검사
    if (!allowedExtensions.includes(fileExtension)) {
      alert('이미지 파일만 업로드 가능합니다. (jpg, jpeg, png, gif)');
      e.target.value = ''; // input 리셋
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);

      const result = await jaxios.post("/api/post/fileupload", formData);

      // 업로드된 이미지 URL을 상태에 추가
      setImgSrcs((prevImgSrcs) => {
        const newImgSrcs = [...prevImgSrcs];
        newImgSrcs[index] = `http://localhost:8070/userimg/${result.data.filename}`;
        return newImgSrcs;
      });

      // 파일명 리스트 업데이트
      setImgList((prevImgList) => {
        const newImgList = [...prevImgList];
        newImgList[index] = result.data.filename; // 해당 인덱스에 파일명 저장
        return newImgList;
      });

      // 업로드된 이미지 스타일 조정
      setImgStyle((prevStyles) => {
        const newStyles = [...prevStyles];
        newStyles[index] = { display: 'block', width: '200px' };
        return newStyles;
      });

    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  // 이미지 삭제 함수
  const removeImage = (index) => {
    setImgSrcs((prevImgSrcs) => {
      const newImgSrcs = [...prevImgSrcs];
      newImgSrcs[index] = ""; // 삭제할 이미지 위치 초기화
      return newImgSrcs;
    });

    setImgList((prevImgList) => {
      const newImgList = [...prevImgList];
      newImgList[index] = ""; // 삭제할 파일명 위치 초기화
      return newImgList;
    });

    setImgStyle((prevStyles) => {
      const newStyles = [...prevStyles];
      newStyles[index] = { display: 'none' }; // 스타일도 변경
      return newStyles;
    });
  }

  // 게시글 작성 함수
  async function onSubmit(event) {
    event.preventDefault(); // 기본 동작 방지

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    // 유효한 이미지가 하나 이상 있는지 확인
    const validImages = imgList.filter(img => img); // 빈 값이 아닌 파일만 필터링
    if (validImages.length === 0) {
      alert("사진을 최소 1장 이상 첨부해주세요.");
      return;
    }

    try {
      const result = await jaxios.post("/api/post/writePost", {
        content,
        member: { memberId: loginUser.memberId },
      });

      const post_id = result.data.postid;

      await Promise.all(
        validImages.map((filename) =>
          jaxios.post("/api/post/writeImages", {
            postId: post_id,
            savefileName: filename,
          })
        )
      );

      if (result.data.msg === "ok") {
        alert("작성이 완료되었습니다.");
        closeSideViewer();
        navigate("/main");
      }

    } catch (error) {
      console.error("Error submitting post:", error);
    }
  }

  return (
    <div className="SideContainer">
      <div className="Content">
        <div className="postWrite">
          <div className="title" style={{ fontSize: "150%" }}>
            {loginUser.nickname} 님 #today
          </div>

          <form onSubmit={onSubmit} id="write-form">
            <div className="field">
              <label style={{ display: "none" }}>content</label>
              <div className="bubble-wrapper">
                <textarea
                  className="bubble-textarea"
                  rows="7"
                  placeholder="오늘의 이야기를 적어볼까요?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              </div>
            </div>

            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="field"
                style={{
                  display: index === 0 || index < imgList.length + 1 ? "flex" : "none",
                }}
              >
                <label htmlFor={`file-${index}`}>
                  <div className="field">
                    파일 첨부
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif"
                      id={`file-${index}`}
                      onChange={(e) => imgUpload(e, index)}
                    />
                    {imgSrcs[index] && (
                      <div>
                        <img src={imgSrcs[index]} style={imgStyle[index]} alt={`uploaded-${index}`} />
                        <button type="button" onClick={() => removeImage(index)}>삭제</button> {/* 삭제 버튼 */}
                      </div>
                    )}
                  </div>
                </label>
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
