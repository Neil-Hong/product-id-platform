import React, { useState } from "react";
import { useDispatch } from "react-redux";
import "./LoginPage.style.scss";
import { API } from "aws-amplify";
import { userLogIn } from "../../redux/users/userSlice";
import { useNavigate } from "react-router-dom";
import { changeLoading } from "../../redux/users/productSlice";
import { ToastContainer, toast } from "react-toastify";

const LoginPage = () => {
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const notify = (text) => {
        toast.error(text, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            className: "toast",
        });
    };

    const successNotify = (text) => {
        toast.success(text, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            className: "toast",
        });
    };
    const handleLoginSubmit = async (e) => {
        dispatch(changeLoading(true));
        e.preventDefault();
        try {
            const data = {
                body: {
                    username: inputs.username,
                    password: inputs.password,
                },
            };
            const apiData = await API.post("authApi", "/auth/login", data);
            successNotify(apiData.message);
            dispatch(userLogIn(data.body.username));
            dispatch(changeLoading(false));
            setTimeout(() => window.location.replace(`/manage/${inputs.username}`), 5000);
        } catch (error) {
            notify(error.response.data.message);
            dispatch(changeLoading(false));
        }
    };
    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
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
                        <div className="loginPage-text">
                            Do not have an account? <p onClick={() => navigate("/register")}>Register Here.</p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
