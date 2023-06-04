import React from "react";
import "./homepage.style.scss";
import StartButton from "../../components/StartButton";

const HomePage = () => {
    return (
        <div className="homepage-container">
            <img src="/img/V-ID-Logo.webp" alt="homeLogo" />
            <StartButton />
        </div>
    );
};

export default HomePage;
