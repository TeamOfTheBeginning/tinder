import React, { useState, useEffect } from 'react';
import jaxios from '../../util/jwtUtil';

import '../../style/post/statistics.css';

const Statistics = () => {
  const [statistics, setStatistics] = useState();
  const [countdown, setCountdown] = useState(3); // 3초 카운트다운 상태

  useEffect(() => {        
      jaxios.get(`/api/quiz/getStatistics`)
          .then((result) => {
              setStatistics(result.data.quizStatistics);
          })
          .catch((err) => { console.error(err) });

      jaxios.get(`/api/post/getAd`)
  }, []);

  useEffect(() => {
      if (countdown > 0) {
          const timer = setTimeout(() => {
              setCountdown(countdown - 1);
          }, 1000);
          return () => clearTimeout(timer);
      }
  }, [countdown]);

  return (
    <div className='statisticsContainer'>
        {/* 통계 정보를 출력합니다. */}
        {statistics ? (
            <>
                <div><h3>이심전심 퀴즈 결과</h3></div>
                <div>{statistics.content} (1번 {(statistics.ratio) * 100} %)</div>
                {/* <div>정답률 : 1번 {(statistics.ratio) * 100} %</div> */}
            </>
        ) : ("Loading...")}<br/>

        <h3>광고페이지 입니다. <br/>({countdown}초 후 이동)</h3><br/>
        <div className='img'>
          <img src={`${process.env.REACT_APP_ADDRESS2}/userimg/다이브1.png`} />
        </div>
    </div>
  );
}

export default Statistics;
