import React from "react";
import "../style/loading.css"; // 공통 CSS 파일

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <div className="loading-spinner"></div>
      <div className="blur-circle"></div>
    </div>
  );
};

export default LoadingSpinner;
