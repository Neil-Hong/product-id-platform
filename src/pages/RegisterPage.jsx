import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "aws-amplify";

const RegisterPage = () => {
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const res = await axios.post("/api/auth/register", inputs);
    //         console.log(res);
    //         navigate("/login");
    //     } catch (error) {
    //         alert(error.response.data.message);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("called");
        const data = {
            body: {
                username: inputs.username,
                email: inputs.email,
                password: inputs.password,
            },
        };
        try {
            const apiData = await API.post("authApi", "/auth/register", data);
            console.log(apiData);
            alert(apiData.message);
            // navigate("/login");
        } catch (error) {
            alert(error.response.data.message);
        }
    };
    return (
        <div className="loginPage-container">
            <div className="loginPage-wrapper">
                <h2 className="title">Register</h2>
                <form>
                    <div className="loginPage-user-box">
                        <input type="text" name="username" required onChange={handleChange}></input>
                        <label>Username</label>
                    </div>
                    <div className="loginPage-user-box">
                        <input type="email" name="email" required onChange={handleChange}></input>
                        <label>Email</label>
                    </div>
                    <div className="loginPage-user-box">
                        <input type="password" name="password" required onChange={handleChange}></input>
                        <label>Password</label>
                    </div>
                    <div className="button-wrapper" onClick={handleSubmit}>
                        <a href="/" className="button">
                            Register
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
