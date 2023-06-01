import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "aws-amplify";
import { useDispatch } from "react-redux";
import { changeLoading } from "../../redux/users/productSlice";
import { ToastContainer, toast } from "react-toastify";

const RegisterPage = () => {
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(changeLoading(true));

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
            successNotify(apiData.message);
            dispatch(changeLoading(false));
            navigate("/login");
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
        </>
    );
};

export default RegisterPage;
