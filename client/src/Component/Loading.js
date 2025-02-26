import React, { useEffect, useState } from "react";
import "../style/loading.css";
import { useSelector } from "react-redux"; // Redux 상태 가져오기

const Loading = ({ onComplete }) => {
    const [step, setStep] = useState(1);

    // Redux에서 loginUser 가져오기
    const loginUser = useSelector((state) => state.user);

    useEffect(() => {
        if (step === 1) {
            const timer = setTimeout(() => {
                setStep(2);
            }, 3000); // 3초
            return () => clearTimeout(timer);
        } else if (step === 2) {
            const timer = setTimeout(() => {
                if (typeof onComplete === "function") {
                    onComplete(); // ✅ 함수일 때만 실행
                } else {
                    console.error("onComplete is not a function or is undefined.");
                }
            }, 2500); // 2.5초
            return () => clearTimeout(timer);
        }
    }, [step, onComplete]);

    return (
        <div className="loading-container">
            {/* blur-circle는 step === 2일 때만 표시 */}
            {step === 2 && <div className="blur-circle"></div>}

            {/* 공통 로딩 애니메이션 */}
            <div className="loader"></div>

            {step === 1 && (
                <div className="animation-step1">
                    <h1>{loginUser.nickname}님<br />
                    🎉 안녕하세요! 🎉</h1>
                    <h2>오늘 하루 설렘의 시작😊</h2>
                    <img
                        src={`${process.env.REACT_APP_ADDRESS2}/userimg/White Square Tinder App Logo Symbol.png`}
                        alt="Logo"
                    />
                </div>
            )}
            {step === 2 && (
                <div className="animation-step2">
                    <div className="heart-animation">
                        <div className="heart"></div>
                    </div>
                    <h2>설렘 충전 중...</h2>
                </div>
            )}
        </div>
    );
};

// 기본값 설정 (onComplete가 없을 경우 대비)
Loading.defaultProps = {
    onComplete: () => console.log("Loading 완료!"),
};

export default Loading;
