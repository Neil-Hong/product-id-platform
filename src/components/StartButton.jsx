import React from "react";
import "./startbutton.style.scss";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const StartButton = () => {
    const navigate = useNavigate();
    const loggedIn = useSelector((state) => state.user.loggedIn);
    const loggedInAs = useSelector((state) => state.user.username);
    return (
        <button
            className="startbutton"
            onClick={loggedIn ? () => window.location.replace(`/manage/${loggedInAs}`) : () => navigate("/login")}
        >
            Start
        </button>
    );
};

export default StartButton;
