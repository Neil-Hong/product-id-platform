import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import "./LoginPage.style.scss";
import { API } from "aws-amplify";
import { userLogIn } from "../../redux/users/userSlice";

const LoginPage = () => {
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
    });

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                body: {
                    username: inputs.username,
                    password: inputs.password,
                },
            };
            const apiData = await API.post("authApi", "/auth/login", data);
            alert(apiData.message);
            dispatch(userLogIn(data.body.username));
            window.location.replace(`/manage/${inputs.username}`);
        } catch (error) {
            alert(error.response.data.message);
        }
    };
    return (
        <div className="loginPage-container">
            <div className="loginPage-wrapper">
                <h2 className="title">Login</h2>
                <form>
                    <div className="loginPage-user-box">
                        <input type="text" name="username" required onChange={handleChange}></input>
                        <label>Username</label>
                    </div>
                    <div className="loginPage-user-box">
                        <input type="password" name="password" required onChange={handleChange}></input>
                        <label>Password</label>
                    </div>
                    <div>
                        <div className="button-wrapper" onClick={handleLoginSubmit}>
                            <a href="/" className="button">
                                Login
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
