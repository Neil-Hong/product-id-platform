import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { RiEdit2Fill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { changeLoading } from "../../redux/users/productSlice";
import { ToastContainer, toast } from "react-toastify";
import { updateBusinessName } from "../../redux/users/userSlice";

const ManageAccount = (props) => {
    const [inputs, setInputs] = useState({
        business_name: "",
        address: "",
        website: "",
        // brandName: "",
        // category: "Fashion",
    });
    const [business, setBusiness] = useState({});
    const [editing, setEditing] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        getBusinessName();
    }, []);

    const getBusinessName = async () => {
        dispatch(changeLoading(true));
        try {
            const data = {
                body: {
                    username: props.username,
                },
            };
            const apiData = await API.post("productApi", "/products/getBusinessName", data);
            setBusiness(apiData);
            dispatch(changeLoading(false));
            dispatch(updateBusinessName(apiData.businessName));
        } catch (error) {
            console.log(error.response);
            dispatch(changeLoading(false));
        }
    };

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleEdit = () => {
        setEditing(false);
    };

    const notify = (text) => {
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

    const handleRegister = async (e) => {
        e.preventDefault();
        dispatch(changeLoading(true));
        const data = {
            body: {
                username: props.username,
                business_name: inputs.business_name,
                address: inputs.address,
                website: inputs.website,
                // brandName: inputs.brandName,
                // category: inputs.category,
            },
        };
        // console.log(data);
        try {
            const apiData = await API.post("productApi", "/products/registerBusiness", data);
            notify(apiData.message);

            dispatch(changeLoading(false));
            setTimeout(() => window.location.reload(), 5000);
        } catch (error) {
            console.log(error.response);
            dispatch(changeLoading(false));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        dispatch(changeLoading(true));
        const data = {
            body: {
                username: props.username,
                business_name: inputs.business_name,
                address: inputs.address,
                website: inputs.website,
                // brandName: inputs.brandName,
                // category: inputs.category,
            },
        };
        // console.log(data);
        try {
            const apiData = await API.post("productApi", "/products/updateBusiness", data);
            dispatch(changeLoading(false));
            notify(apiData.message);
            setTimeout(() => window.location.reload(), 5000);

            setEditing(false);
        } catch (error) {
            console.log(error.response);
            dispatch(changeLoading(false));
        }
    };
    console.log(inputs);
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
            {business && business.businessName ? (
                <div style={{ marginBottom: "30px" }}>
                    <span>Business Details</span>
                    <RiEdit2Fill onClick={handleEdit} style={{ cursor: "pointer" }} />
                    <hr style={{ margin: "10px auto" }} />
                    <div className="ManagePages-card-right-content">
                        <div className="ManagePages-card-right-content-title">Name</div>
                        {business.businessName && editing ? (
                            <>
                                <div>{business.businessName}</div>
                            </>
                        ) : (
                            <input
                                type="text"
                                name="business_name"
                                onChange={handleChange}
                                placeholder={business.businessName}
                            />
                        )}
                    </div>
                    <div className="ManagePages-card-right-content">
                        <div className="ManagePages-card-right-content-title">Address</div>
                        {business.businessName && editing ? (
                            <div>{business.businessAddress}</div>
                        ) : (
                            <input
                                type="text"
                                name="address"
                                onChange={handleChange}
                                placeholder={business.businessAddress}
                            />
                        )}
                    </div>
                    <div className="ManagePages-card-right-content">
                        <div className="ManagePages-card-right-content-title">Website</div>
                        {business.businessName && editing ? (
                            <>
                                <div>{business.businessWebsite}</div>
                            </>
                        ) : (
                            <input
                                type="text"
                                name="website"
                                onChange={handleChange}
                                placeholder={business.businessWebsite}
                            />
                        )}
                    </div>
                    {business.businessName && editing ? null : (
                        <button className="ManagePages-btn right" onClick={handleUpdate}>
                            Update
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <span>Business Details</span>
                    <hr style={{ margin: "10px auto" }} />
                    <div className="ManagePages-card-right-content">
                        <div className="ManagePages-card-right-content-title">Name</div>
                        <input type="text" name="business_name" onChange={handleChange} />
                    </div>
                    <div className="ManagePages-card-right-content">
                        <div className="ManagePages-card-right-content-title">Address</div>
                        <input type="text" name="address" onChange={handleChange} />
                    </div>
                    <div className="ManagePages-card-right-content">
                        <div className="ManagePages-card-right-content-title">Website</div>
                        <input type="text" name="website" onChange={handleChange} />
                    </div>
                    <div>
                        <button className="ManagePages-btn right" onClick={handleRegister}>
                            Register
                        </button>
                    </div>
                </>
            )}
        </>
    );
};

export default ManageAccount;
