import React, { useState, useEffect } from 'react';
import jaxios from '../../util/jwtUtil';

import '../../style/post/statistics.css';

const Statistics = () => {

    const [statistics, setStatistics] = useState();

    useEffect(() => {        
        jaxios.get(`/api/quiz/getStatistics`)
            .then((result) => {
                // console.log("result.data.quizStatistics"+result.data.quizStatistics)
                // console.log(JSON.stringify(result.data.quizStatistics))
                setStatistics(result.data.quizStatistics);

            }).catch((err) => { console.error(err) });
    }, []);


  return (
    <div className='statisticsContainer'>
      {/* 통계 정보를 출력합니다. */}
      {(statistics)?(
        <>
            <div><h3>이심전심 퀴즈 통계</h3></div>
            <div>문제 : {statistics.content}</div>
            <div>정답률 : 1번 {(statistics.ratio)*100} %</div>
        </>
      ):("Loading...")}
      
    </div>
  )
}

export default Statistics
