import React from "react";
import "./loading.style.scss";

const Loading = () => {
    return (
        <>
            <div className="loading-container">
                <div className="container">
                    <div className="dot dot-1"></div>
                    <div className="dot dot-2"></div>
                    <div className="dot dot-3"></div>
                </div>
            </div>

            {/* <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7" />
                    </filter>
                </defs>
            </svg> */}
        </>
    );
};

export default Loading;
