import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";

const ManageProduct = (props) => {
    const [input, setInput] = useState({
        brandName: "",
        category: "",
        selectedValue: [],
        product_name: "",
        specification: "",
        materials: "",
        c_inputs: "",
        practises: "",
        dynamicProductName: [],
        dynamicSpecification: [],
        dynamicC_inputs: [],
        dynamicMaterials: [],
        dynamicPractises: [],
    });
    const [divs, setDivs] = useState([]);
    const [divNum, setDivNum] = useState(2);

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value, dataset } = e.target;
        if (name === "brandName") {
            const brandObj = input.selectedValue.find((item) => item.brand_name === value);
            const category = brandObj ? brandObj.brand_category : "";
            setInput((prev) => ({
                ...prev,
                [name]: value,
                category: category,
            }));
        } else if (name === "dynamicProductName") {
            const index = parseInt(dataset.index, 10); // Parse index as integer
            setInput((prev) => {
                const dynamicProductName = [...prev.dynamicProductName];
                dynamicProductName[index - 2] = value;
                return { ...prev, dynamicProductName };
            });
        } else if (name === "dynamicC_inputs") {
            const index = parseInt(dataset.index, 10); // Parse index as integer
            setInput((prev) => {
                const dynamicC_inputs = [...prev.dynamicC_inputs];
                dynamicC_inputs[index - 2] = value;
                return { ...prev, dynamicC_inputs };
            });
        } else if (name === "dynamicMaterials") {
            const index = parseInt(dataset.index, 10); // Parse index as integer
            setInput((prev) => {
                const dynamicMaterials = [...prev.dynamicMaterials];
                dynamicMaterials[index - 2] = value;
                return { ...prev, dynamicMaterials };
            });
        } else if (name === "dynamicSpecification") {
            const index = parseInt(dataset.index, 10); // Parse index as integer
            setInput((prev) => {
                const dynamicSpecification = [...prev.dynamicSpecification];
                dynamicSpecification[index - 2] = value;
                return { ...prev, dynamicSpecification };
            });
        } else if (name === "dynamicPractises") {
            const index = parseInt(dataset.index, 10); // Parse index as integer
            setInput((prev) => {
                const dynamicPractises = [...prev.dynamicPractises];
                dynamicPractises[index - 2] = value;
                return { ...prev, dynamicPractises };
            });
        } else {
            setInput((prev) => ({ ...prev, [name]: value }));
        }
    };

    const removeDiv = (id) => {
        setDivs((prevDivs) => prevDivs.filter((div) => div.key !== id.toString()));
        setDivNum((prevNum) => prevNum - 1);
        setInput((prevInputs) => {
            const dynamicProductName = [...prevInputs.dynamicProductName];
            dynamicProductName.splice(id - 2, 1);
            const dynamicC_inputs = [...prevInputs.dynamicC_inputs];
            dynamicC_inputs.splice(id - 2, 1);
            const dynamicMaterials = [...prevInputs.dynamicMaterials];
            dynamicMaterials.splice(id - 2, 1);
            const dynamicPractises = [...prevInputs.dynamicPractises];
            dynamicPractises.splice(id - 2, 1);
            const dynamicSpecification = [...prevInputs.dynamicSpecification];
            dynamicSpecification.splice(id - 2, 1);
            return {
                ...prevInputs,
                dynamicProductName,
                dynamicC_inputs,
                dynamicMaterials,
                dynamicPractises,
                dynamicSpecification,
            };
        });
    };

    useEffect(() => {
        getBrand();
    }, []);

    const addProducts = async () => {
        const data = {
            body: {
                username: props.username,
                brand_name: input.brandName,
                category: input.category,
                product_name: [...input.dynamicProductName, input.product_name],
                specification: [...input.dynamicSpecification, input.specification],
                materials: [...input.dynamicMaterials, input.materials],
                c_inputs: [...input.dynamicC_inputs, input.c_inputs],
                practises: [...input.dynamicPractises, input.practises],
            },
        };
        try {
            const apiData = await API.post("productApi", "/products/addProducts", data);
            alert(apiData.message);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const getBrand = async () => {
        const data = {
            body: {
                username: props.username,
            },
        };
        try {
            const apiData = await API.post("productApi", "/products/getBrandName", data);
            const brandList = apiData.brandName || [];
            setInput((prev) => ({ ...prev, selectedValue: brandList }));
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const addProductDivs = () => {
        const id = divNum; // Unique ID for each div
        const newDiv = (
            <div key={id} style={{ marginTop: "30px" }}>
                <div className="ManagePage-product">
                    <div className="ManagePage-product-subtitle">Product {divNum}</div>
                    <button
                        className="ManagePages-btn circle"
                        onClick={() => {
                            removeDiv(id);
                        }}
                    >
                        -
                    </button>
                </div>
                <hr style={{ margin: "10px auto" }} />
                <div className="ManagePages-card-right-content">
                    <div className="ManagePages-card-right-content-title">Product Name</div>
                    <input type="text" onChange={handleChange} name="dynamicProductName" data-index={divNum} />
                </div>
                <div className="ManagePages-card-right-content">
                    <div className="ManagePages-card-right-content-title">Specification</div>
                    <input type="text" onChange={handleChange} name="dynamicSpecification" data-index={divNum} />
                </div>
                <div className="ManagePages-card-right-content">
                    <div className="ManagePages-card-right-content-title">Chemica Inputs</div>
                    <input type="text" onChange={handleChange} name="dynamicC_inputs" data-index={divNum} />
                </div>
                <div className="ManagePages-card-right-content">
                    <div className="ManagePages-card-right-content-title">Materials</div>
                    <input type="text" onChange={handleChange} name="dynamicMaterials" data-index={divNum} />
                </div>
                <div className="ManagePages-card-right-content">
                    <div className="ManagePages-card-right-content-title">Practises</div>
                    <input type="text" onChange={handleChange} name="dynamicPractises" data-index={divNum} />
                </div>
            </div>
        );
        setDivNum((prevNum) => prevNum + 1);
        setDivs([...divs, newDiv]);
        setInput((prev) => ({
            ...prev,
            dynamicProductName: [...prev.dynamicProductName],
            dynamicC_inputs: [...prev.dynamicC_inputs],
            dynamicMaterials: [...prev.dynamicMaterials],
            dynamicPractises: [...prev.dynamicPractises],
            dynamicSpecification: [...prev.dynamicSpecification],
        }));
    };

    console.log(input);

    return (
        <>
            <span>Product Details</span>
            <hr style={{ margin: "10px auto" }} />
            <div className="ManagePages-card-right-content">
                <div className="ManagePages-card-right-content-title">Brand</div>
                <select onChange={handleChange} name="brandName" value={input.brandName}>
                    <option value="">Select Brand</option>
                    {input.selectedValue.map((item, index) => (
                        <option key={index} value={item.brand_name}>
                            {item.brand_name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="ManagePages-card-right-content">
                <div className="ManagePages-card-right-content-title">Category</div>
                {input.category}
            </div>
            <div className="ManagePage-product">
                <div className="ManagePage-product-subtitle">Product 1</div>
                <button className="ManagePages-btn circle" onClick={addProductDivs}>
                    +
                </button>
            </div>
            <hr style={{ margin: "0 0 10px 0" }} />
            <div className="ManagePages-card-right-content">
                <div className="ManagePages-card-right-content-title">Product Name</div>
                <input type="text" onChange={handleChange} name="product_name" />
            </div>
            <div className="ManagePages-card-right-content">
                <div className="ManagePages-card-right-content-title">Specification</div>
                <input type="text" onChange={handleChange} name="specification" />
            </div>
            <div className="ManagePages-card-right-content">
                <div className="ManagePages-card-right-content-title">Chemical Inputs</div>
                <input type="text" onChange={handleChange} name="c_inputs" />
            </div>
            <div className="ManagePages-card-right-content">
                <div className="ManagePages-card-right-content-title">Materials</div>
                <input type="text" onChange={handleChange} name="materials" />
            </div>
            <div className="ManagePages-card-right-content">
                <div className="ManagePages-card-right-content-title">Practises</div>
                <input type="text" onChange={handleChange} name="practises" />
            </div>

            {/* <div className="ManagePages-card-right-content textInput">
                <span>Additional Information</span>
                <textarea onChange={handleChange} name="textInput"></textarea>
            </div> */}
            {divs.map((div) => div)}
            <div>
                <button className="ManagePages-btn right" onClick={getBrand}>
                    Add Product
                </button>
                <button className="ManagePages-btn right" style={{ marginLeft: "20px" }} onClick={addProducts}>
                    Update
                </button>
            </div>
        </>
    );
};

export default ManageProduct;
