import React, { useState, useEffect, useRef } from 'react';
import jaxios from '../../util/jwtUtil';

import '../../style/post/statistics.css';

const Statistics = () => {
  const [statistics, setStatistics] = useState();
  const [ads, setAds] = useState();
  const [countdown, setCountdown] = useState(5); // 5초 카운트다운 상태
  const [loading, setLoading] = useState(false); // 로딩 상태 추적
  const [progress, setProgress] = useState(0); // 진행 상태 (0~100)
  const progressRef = useRef(progress);

  useEffect(() => {
    jaxios.get(`/api/quiz/getStatistics`)
      .then((result) => {
        setStatistics(result.data.quizStatistics);
      })
      .catch((err) => { console.error(err) });

    jaxios.get(`/api/post/getAd`)
      .then((result) => {
        setAds(result.data.ads);
      })
      .catch((err) => { console.error(err) });
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      setLoading(true); // 로딩 시작
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setLoading(false); // 카운트다운이 끝나면 로딩 종료
    }
  }, [countdown]);

  // 진행 상태를 부드럽게 애니메이션 처리
  useEffect(() => {
    const targetProgress = (5 - countdown) * 20; // 진행 상태 (0 ~ 100)
    if (progress < targetProgress) {
      const animateProgress = () => {
        const step = Math.min(2, targetProgress - progress); // 매번 2씩 증가 (부드럽게)
        progressRef.current += step;
        setProgress(progressRef.current);
        if (progressRef.current < targetProgress) {
          requestAnimationFrame(animateProgress);
        }
      };
      requestAnimationFrame(animateProgress);
    }
  }, [countdown, progress]);

  return (
    <div className='statisticsContainer'>
      <h2>광고페이지 입니다. </h2>
      {ads ? (
        <>
          <h3>틴더는 <br /> (주){ads.advertiser}와 함께 합니다.</h3>
          <div className='img'>
            <img src={`${process.env.REACT_APP_ADDRESS2}/userimg/${ads.adImage}`} />
          </div>
          <br />
          {loading ? (
            <>
              {/* 커스텀 로딩 바 */}
              <div className="loading-bar-container">
                <div
                  className="loading-bar"
                  style={{
                    width: `${progress}%`, // 부드럽게 진행되는 상태
                  }}
                />
              </div>
              <br />
              ({countdown}초 후 이동)
            </>
          ) : (
            <p>이동중...</p>
          )}
        </>
      ) : ("Loading...")}
      <hr />

      {/* 통계 정보를 출력합니다. */}
      {statistics ? (
        <>
          <div><h3>이심전심 퀴즈 결과</h3></div>
          <div>{statistics.content} (1번 {(statistics.ratio) * 100} %)</div>
        </>
      ) : ("Loading...")}<br />
    </div>
  );
}

export default Statistics;
