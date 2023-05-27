import React, { useState } from "react";
import { API } from "aws-amplify";
import { RiEdit2Fill } from "react-icons/ri";

const ManageAccount = (props) => {
    const [inputs, setInputs] = useState({
        business_name: "",
        address: "",
        website: "",
        // brandName: "",
        // category: "Fashion",
    });
    const [editing, setEditing] = useState(false);

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
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
            alert(apiData.message);
            window.location.reload();
        } catch (error) {
            console.log(error.response);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
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
            alert(apiData.message);
            window.location.reload();
            setEditing(false);
        } catch (error) {
            console.log(error.response);
        }
    };
    return (
        <>
            {props.receivedBusiness ? (
                <div style={{ marginBottom: "30px" }}>
                    <span>Business Details</span>
                    <RiEdit2Fill onClick={handleEdit} style={{ cursor: "pointer" }} />
                    <hr style={{ margin: "10px auto" }} />
                    <div className="ManagePages-card-right-content">
                        <div className="ManagePages-card-right-content-title">Name</div>
                        {editing ? (
                            <input
                                type="text"
                                name="business_name"
                                onChange={handleChange}
                                placeholder={props.receivedBusiness.businessName}
                            />
                        ) : (
                            <>
                                <div>{props.receivedBusiness.businessName}</div>
                            </>
                        )}
                    </div>
                    <div className="ManagePages-card-right-content">
                        <div className="ManagePages-card-right-content-title">Address</div>
                        {editing ? (
                            <input
                                type="text"
                                name="address"
                                onChange={handleChange}
                                placeholder={props.receivedBusiness.businessAddress}
                            />
                        ) : (
                            <div>{props.receivedBusiness.businessAddress}</div>
                        )}
                    </div>
                    <div className="ManagePages-card-right-content">
                        <div className="ManagePages-card-right-content-title">Website</div>
                        {editing ? (
                            <input
                                type="text"
                                name="website"
                                onChange={handleChange}
                                placeholder={props.receivedBusiness.businessWebsite}
                            />
                        ) : (
                            <>
                                <div>{props.receivedBusiness.businessWebsite}</div>
                            </>
                        )}
                    </div>
                    {editing ? (
                        <button className="ManagePages-btn right" onClick={handleUpdate}>
                            Update
                        </button>
                    ) : null}
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
                        {/* <button className="ManagePages-btn right" style={{ marginLeft: "20px" }}>
                    Update
                </button> */}
                    </div>
                </>
            )}
        </>
    );
};

export default ManageAccount;
