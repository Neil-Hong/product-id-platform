import React, { useState } from "react";
import { API } from "aws-amplify";

const ManageBrand = (props) => {
    const [input, setInputs] = useState({
        brand_name: "",
        category: "Fashion",
        batchNo: "",
        RefNo: "",
        textInput: "",
        selectedValue: "Gucci",
        dynamicInputs: [],
        dynamicCategories: [],
    });
    const [divs, setDivs] = useState([]);
    const [divNum, setDivNum] = useState(2);
    const addDivs = () => {
        const id = divNum; // Unique ID for each div

        const newDiv = (
            <div key={id} style={{ marginTop: "30px" }}>
                <div className="ManagePage-product">
                    <div className="ManagePage-product-subtitle">Brand {divNum}</div>
                    <button className="ManagePages-btn circle" onClick={() => removeDiv(id)}>
                        -
                    </button>
                </div>
                <hr style={{ margin: "0px 0 10px 0" }} />
                <div className="ManagePages-card-right-content">
                    <div className="ManagePages-card-right-content-title">Name</div>
                    <input type="text" name="dynamicInputs" data-index={divNum} onChange={handleChange} />
                </div>
                <div className="ManagePages-card-right-content">
                    <div className="ManagePages-card-right-content-title">Category</div>
                    <select onChange={handleChange} name="dynamicCategories" data-index={divNum}>
                        <option value={"Fashion"}>Fashion</option>
                        <option value={"Fast-consumeable"}>Fast-consumeable</option>
                        <option value={"Other"}>Other</option>
                    </select>
                </div>
            </div>
        );
        setDivNum((prevNum) => prevNum + 1);
        setDivs([...divs, newDiv]);
        setInputs((prev) => ({
            ...prev,
            dynamicInputs: [...prev.dynamicInputs],
            dynamicCategories: [...prev.dynamicCategories],
        }));
    };
    const handleChange = (e) => {
        const { name, value, dataset } = e.target;
        if (name === "dynamicInputs") {
            const index = parseInt(dataset.index, 10); // Parse index as integer
            console.log(index);
            setInputs((prev) => {
                const dynamicInputs = [...prev.dynamicInputs];
                dynamicInputs[index - 2] = value;
                return { ...prev, dynamicInputs };
            });
        } else if (name === "dynamicCategories") {
            const index = parseInt(dataset.index, 10); // Parse index as integer
            setInputs((prev) => {
                const dynamicCategories = [...prev.dynamicCategories];
                dynamicCategories[index - 2] = value;
                return { ...prev, dynamicCategories };
            });
        } else {
            setInputs((prev) => ({ ...prev, [name]: value }));
        }
    };
    const handleAdd = () => {
        try {
            let file = props.makeFile(input);
            props.storeFile(file);
            alert("Files are stored successfully!");
        } catch (error) {
            alert("Failed to store files, please try again.");
        }
    };

    const removeDiv = (id) => {
        setDivs((prevDivs) => prevDivs.filter((div) => div.key !== id.toString()));
        setDivNum((prevNum) => prevNum - 1);
        setInputs((prevInputs) => {
            const dynamicInputs = [...prevInputs.dynamicInputs];
            dynamicInputs.splice(id - 2, 1);
            const dynamicCategories = [...prevInputs.dynamicCategories];
            dynamicCategories.splice(id - 2, 1);
            return {
                ...prevInputs,
                dynamicInputs,
                dynamicCategories,
            };
        });
    };

    const registerBrands = async (e) => {
        e.preventDefault();
        const data = {
            body: {
                username: props.username,
                brand_name: [...input.dynamicInputs, input.brand_name],
                brand_category: [...input.dynamicCategories, input.category],
                business_name: props.businessName,
            },
        };
        try {
            const apiData = await API.post("productApi", "/products/registerBrands", data);
            alert(apiData.message);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    console.log(input);
    return (
        <>
            <span>Brand Details</span>
            <div className="ManagePage-product">
                <div className="ManagePage-product-subtitle">Brand 1</div>
                <button className="ManagePages-btn circle" onClick={addDivs}>
                    +
                </button>
            </div>

            <hr style={{ margin: "0 0 10px 0" }} />
            <div className="ManagePages-card-right-content">
                <div className="ManagePages-card-right-content-title">Name</div>
                <input type="text" name="brand_name" onChange={handleChange} />
            </div>
            <div className="ManagePages-card-right-content">
                <div className="ManagePages-card-right-content-title">Category</div>
                <select onChange={handleChange} name="category">
                    <option value={"Fashion"}>Fashion</option>
                    <option value={"Fast-consumable"}>Fast-consumable</option>
                    <option value={"Other"}>Other</option>
                </select>
            </div>

            {divs.map((div) => div)}
            <div>
                <button className="ManagePages-btn right" style={{ marginTop: "20px" }} onClick={registerBrands}>
                    Add
                </button>
                {/* <button className="ManagePages-btn right" style={{ marginLeft: "20px" }}>
                    Update
                </button> */}
            </div>
        </>
    );
};

export default ManageBrand;
