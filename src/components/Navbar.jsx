import React, { useEffect, useState } from "react";
import "./navbar.style.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogOut } from "../redux/users/userSlice";

const Navbar = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loggedIn = useSelector((state) => state.user.loggedIn);
    const loggedInAs = useSelector((state) => state.user.username);

    const logOut = () => {
        dispatch(userLogOut());
        navigate("/");
    };
    return (
        <div className="navbar">
            <div className="navbar-title" onClick={() => navigate("/")}>
                <img src="/img/V-ID-Logo.webp" alt="nav-logo" />
                <p>Veritas-ID.Org</p>
            </div>
            <div>
                {loggedIn ? (
                    <>
                        <span>User: {loggedInAs}</span>
                        <span className="logout" onClick={logOut}>
                            Logout
                        </span>
                    </>
                ) : (
                    <span className="login" onClick={() => navigate("/login")}>
                        Login
                    </span>
                )}
            </div>
        </div>
    );
};

export default Navbar;
