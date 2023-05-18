import React, { useState } from "react";
import { API } from "aws-amplify";
import { useParams } from "react-router-dom";

const ManageAccount = () => {
    const [inputs, setInputs] = useState({
        business_name: "",
        address: "",
        website: "",
        // brandName: "",
        // category: "Fashion",
    });

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const { id } = useParams();
    const handleRegister = async (e) => {
        e.preventDefault();
        const data = {
            body: {
                username: id,
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
    return (
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
    );
};

export default ManageAccount;
