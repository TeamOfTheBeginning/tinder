import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { validateFile, uploadMultipleFiles } from '../common/FileUploadUtil';
import jaxios from '../../util/jwtUtil';
import '../../style/writePost.css';

const WritePost = ({ closeSideViewer }) => {
  const [imgList, setImgList] = useState([]); // 업로드된 파일명 리스트
  const [imgSrcs, setImgSrcs] = useState([]); // 미리보기 URL 리스트
  const [content, setContent] = useState(''); // 게시글 내용
  const loginUser = useSelector((state) => state.user);

  // ✅ 파일 업로드 함수 (이미지 & 동영상)
async function imgUpload(e) {
  if (!e.target.files.length) return;

  const files = Array.from(e.target.files);

  try {
      // ✅ 파일 검증 (확장자 & 크기)
      const validFiles = files.filter(file => {
          const validation = validateFile(file);
          if (!validation.valid) {
              alert(validation.message);
              return false;
          }
          return true;
      });

      if (validFiles.length === 0) return;

      // ✅ 파일 업로드 요청
      const results = await uploadMultipleFiles(validFiles, '/api/post/fileupload');

      console.log("results"+results)
      console.log("JSON.stringify(results.data)"+JSON.stringify(results))

      if (!results || results.length === 0) {
          alert('파일 업로드에 실패했습니다.');
          return;
      }

      // ✅ 파일 URL 설정 (동영상 & 이미지 구분)
      const newSrcs = results
          .filter(result => result && result.filename)
          .map(result => ({
              url: `${process.env.REACT_APP_ADDRESS2}/userimg/${result.filename}`,
              type: result.filename.split('.').pop().toLowerCase(),
          }));

      setImgSrcs(prev => [...prev, ...newSrcs].slice(0, 10));
      setImgList(prev => [...prev, ...results.map(r => r.filename)].slice(0, 10));

  } catch (error) {
      console.error('파일 업로드 오류:', error);
      alert('파일 업로드 중 오류가 발생했습니다.');
  }
}


  // ✅ 파일 삭제 함수
  const removeFile = (index) => {
    setImgSrcs((prev) => prev.filter((_, i) => i !== index));
    setImgList((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ 게시글 작성 함수
  async function onSubmit(event) {
    event.preventDefault();

    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    if (imgSrcs.length === 0) {
      alert('사진이나 동영상을 최소 1개 이상 첨부해주세요.');
      return;
    }

    try {
      const result = await jaxios.post('/api/post/writePost', {
        content,
        member: { memberId: loginUser.memberId },
      });

      const postId = result.data.postid;

      // ✅ 첨부된 파일 정보 저장
      await Promise.all(
        imgList.map((filename) =>
          jaxios.post('/api/post/writeImages', {
            postId: postId,
            savefileName: filename,
          })
        )
      );

      alert('게시글 작성이 완료되었습니다.');
      closeSideViewer();
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  }

  return (
    <div className='SideContainer'>
      <div className='Content'>
        <div className='postWrite'>
          <h2>{loginUser.nickname} 님 #today</h2>

          <form onSubmit={onSubmit} id='write-form'>
            <div className='field'>
              <label style={{ display: 'none' }}>content</label>
              <div className='bubble-wrapper'>
                <textarea
                  className='bubble-textarea'
                  placeholder='오늘의 이야기 #today'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* ✅ 파일 업로드 input 태그 */}
            <div id='uploadfile'><input type='file' multiple accept='image/jpg, image/jpeg, image/png, image/gif,video/mp4,video/webm,video/ogg' onChange={imgUpload} /></div>

            {/* ✅ 이미지 및 동영상 미리보기 */}
            <div className='preview-container'>
              {imgSrcs.map((file, index) => (
                <div key={index} className='preview-item'>
                  {file.type === 'mp4' || file.type === 'webm' || file.type === 'ogg' ? (
                    <video src={file.url} controls style={{ width: '200px' }} />
                  ) : (
                    <img src={file.url} alt={`uploaded-${index}`} style={{ width: '200px' }} />
                  )}
                  <button type='button' onClick={() => removeFile(index)}>
                    삭제
                  </button>
                </div>
              ))}
            </div>

            <div className='btns'>
              <button type='submit'>작성완료</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WritePost;