import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { Web3Storage } from "web3.storage";
import { tagChosed } from "../../redux/users/userSlice";

const ManageProducts = (props) => {
    const [input, setInput] = useState({
        brand_name: "",
        brand_category: "Fashion",
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
        updateData: [],
        token: [],
    });
    const [divs, setDivs] = useState([]);
    const [divNum, setDivNum] = useState(2);
    const [uploaded, setUploaded] = useState(false);
    const [showProduct, setShowProduct] = useState([]);

    const handleChange = (e) => {
        e.preventDefault();
        const { name, value, dataset } = e.target;
        if (name === "brandName") {
            setShowProduct([]);
            const brandObj = input.selectedValue.find((item) => item.brand_name === value);
            const category = brandObj ? brandObj.brand_category : "";
            setInput((prev) => ({
                ...prev,
                [name]: value,
                category: category,
            }));
            console.log(brandObj);
            if (brandObj) {
                if (brandObj.product_info.length !== 0) {
                    const productInfo = brandObj.product_info.map((item, index) => {
                        return (
                            <>
                                <div className="ManagePage-product">
                                    <div className="ManagePage-product-subtitle">Product {index + 1}</div>
                                </div>
                                <hr style={{ margin: "10px auto" }} />
                                <div className="ManagePages-card-right-content">
                                    <div className="ManagePages-card-right-content-title">Product Name</div>
                                    <div>{item.product_name}</div>
                                </div>
                                <div className="ManagePages-card-right-content">
                                    <div className="ManagePages-card-right-content-title">Specification</div>
                                    <div>{item.specification}</div>
                                </div>
                                <div className="ManagePages-card-right-content">
                                    <div className="ManagePages-card-right-content-title">Chemical Inputs</div>
                                    <div>{item.c_inputs}</div>
                                </div>
                                <div className="ManagePages-card-right-content">
                                    <div className="ManagePages-card-right-content-title">Materials</div>
                                    <div>{item.materials}</div>
                                </div>
                                <div className="ManagePages-card-right-content">
                                    <div className="ManagePages-card-right-content-title">Practises</div>
                                    <div>{item.practises}</div>
                                </div>
                            </>
                        );
                    });
                    setShowProduct([productInfo]);
                } else {
                    setShowProduct([]);
                }
            }
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
        const fileObj = {
            brand_name: input.brandName,
            brand_category: input.category,
            product_info: {
                productName: input.product_name,
                specification: input.specification,
                materials: input.materials,
                practises: input.practises,
                c_inputs: input.c_inputs,
            },
        };
        const cidToken = await storeFiles(fileObj);
        console.log(cidToken);
        setInput((prev) => ({ ...prev, token: [...prev.token, cidToken] }));

        try {
            const data = {
                body: {
                    username: props.username,
                    brand_name: input.brandName,
                    category: input.category,
                    product_name: input.product_name,
                    specification: input.specification,
                    materials: input.materials,
                    c_inputs: input.c_inputs,
                    practises: input.practises,
                    token: [...input.token, cidToken],
                },
            };
            console.log(data);
            const apiData = await API.post("productApi", "/products/addProducts", data);
            // alert(apiData.message);
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
            setInput((prev) => ({ ...prev, updateData: apiData.brandName }));
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

    function getAccessToken() {
        // If you're just testing, you can paste in a token
        // and uncomment the following line:
        // return 'paste-your-token-here'

        //Your token
        return process.env.REACT_APP_WEB3STORAGE_TOKEN;
    }

    function makeStorageClient() {
        return new Web3Storage({ token: getAccessToken() });
    }

    function makeFileObjects(file) {
        // You can create File objects from a Blob of binary data
        // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
        // Here we're just storing a JSON object, but you can store images,
        // audio, or whatever you want!
        const obj = file;
        // const number = Math.random();
        const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });

        const files = [
            new File(["contents-of-file-1"], "plain-utf8.txt"),
            new File([blob], `${file.product_info.productName}.json`),
        ];
        return files;
    }

    async function storeFiles(fileObj) {
        try {
            const client = makeStorageClient();
            let file = makeFileObjects(fileObj);
            const cid = await client.put(file, { name: fileObj.product_info.productName });
            setUploaded(true);
            // const tokenList = [...input.token, cid];
            return cid;
        } catch (error) {
            console.log(error);
        }
    }

    const updateToWeb3 = async () => {
        const fileObj = {
            brand_name: input.brandName,
            brand_category: input.category,
            product_info: {
                productName: input.product_name,
                specification: input.specification,
                materials: input.materials,
                practises: input.practises,
                c_inputs: input.c_inputs,
            },
        };
        storeFiles(fileObj);
    };
    console.log(input);

    const registerBrands = async (e) => {
        e.preventDefault();
        const data = {
            body: {
                username: props.username,
                brand_name: input.brand_name,
                brand_category: input.brand_category,
                business_name: props.businessName,
            },
        };
        try {
            const apiData = await API.post("productApi", "/products/registerBrands", data);
            alert(apiData.message);
            props.dispatch(tagChosed("manageproduct"));
            window.location.reload();
        } catch (error) {
            alert(error.response.data.message);
        }
    };
    //     const selectElement = document.getElementById("selectBrand");
    //     let result = selectElement.addEventListener("change", function (e) {
    //         let selectedBrand = e.target.value;
    //         return selectedBrand;
    //     });
    //     const productInfo = input.selectedValue.find(function (brand) {
    //         return brand.brand_name === result;
    //     });
    //     console.log(productInfo);
    //     if (productInfo) {
    //         productInfo.productInfo.map((item, index) => {
    //             return (
    //                 <>
    //                     <div className="ManagePage-product">
    //                         <div className="ManagePage-product-subtitle">Product {index + 1}</div>
    //                     </div>
    //                     <hr style={{ margin: "10px auto" }} />
    //                     <div className="ManagePages-card-right-content">
    //                         <div className="ManagePages-card-right-content-title">Product Name</div>
    //                         <div>{item.product_name}</div>
    //                     </div>
    //                     <div className="ManagePages-card-right-content">
    //                         <div className="ManagePages-card-right-content-title">Specification</div>
    //                         <div>{item.specification}</div>
    //                     </div>
    //                     <div className="ManagePages-card-right-content">
    //                         <div className="ManagePages-card-right-content-title">Chemical Inputs</div>
    //                         <div>{item.c_inputs}</div>
    //                     </div>
    //                     <div className="ManagePages-card-right-content">
    //                         <div className="ManagePages-card-right-content-title">Materials</div>
    //                         <div>{item.materials}</div>
    //                     </div>
    //                     <div className="ManagePages-card-right-content">
    //                         <div className="ManagePages-card-right-content-title">Practises</div>
    //                         <div>{item.practises}</div>
    //                     </div>
    //                 </>
    //             );
    //         });
    //         console.log("品牌名称:", productInfo.brand_name);
    //         console.log("品牌分类:", productInfo.brand_category);
    //         console.log("产品信息:", productInfo.product_info);
    //     }
    // };

    return (
        <>
            <div className="ManagePage-product-title">
                <span>Brand Details</span>
                {/* <button className="ManagePages-btn circle" onClick={addBrandDivs}>
                    +
                </button> */}
            </div>

            <hr style={{ margin: "0 0 10px 0" }} />
            {input.selectedValue && input.selectedValue.length !== 0 ? (
                input.selectedValue.map((item, index) => {
                    return (
                        <>
                            <div className="ManagePage-product">
                                <div className="ManagePage-product-subtitle">Brand {index + 1}</div>
                            </div>
                            <hr style={{ margin: "10px auto" }} />
                            <div className="ManagePages-card-right-content">
                                <div className="ManagePages-card-right-content-title">Name</div>
                                {item.brand_name}
                            </div>
                            <div className="ManagePages-card-right-content">
                                <div className="ManagePages-card-right-content-title">Category</div>
                                <div>{item.brand_category}</div>
                            </div>
                        </>
                    );
                })
            ) : (
                <></>
            )}
            <div className="ManagePage-product">
                <div className="ManagePage-product-subtitle">Brand Information</div>
            </div>
            <hr style={{ margin: "10px auto" }} />
            <div className="ManagePages-card-right-content">
                <div className="ManagePages-card-right-content-title">Name</div>
                <input type="text" name="brand_name" onChange={handleChange} />
            </div>
            <div className="ManagePages-card-right-content">
                <div className="ManagePages-card-right-content-title">Category</div>
                <select onChange={handleChange} name="brand_category">
                    <option value={"Fashion"}>Fashion</option>
                    <option value={"Fast-consumable"}>Fast-consumable</option>
                    <option value={"Other"}>Other</option>
                </select>
            </div>
            <div>
                <button className="ManagePages-btn right" style={{ marginTop: "20px" }} onClick={registerBrands}>
                    Add Brand
                </button>
            </div>

            <span>Product Details</span>
            <hr style={{ margin: "10px auto" }} />
            <div className="ManagePages-card-right-content">
                <div className="ManagePages-card-right-content-title">Brand</div>
                <select onChange={handleChange} name="brandName" value={input.brandName} id="selectBrand">
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
            {showProduct.map((div) => div)}

            <div className="ManagePage-product">
                <div className="ManagePage-product-subtitle">Product Information</div>
                {/* <button className="ManagePages-btn circle" onClick={addProductDivs}>
                    +
                </button> */}
            </div>
            <hr style={{ margin: "10px auto" }} />
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

            {divs.map((div) => div)}
            <div>
                <button className="ManagePages-btn right" onClick={addProducts}>
                    Add Product
                </button>
                {/* <button className="ManagePages-btn right" style={{ marginLeft: "20px" }} onClick={updateToWeb3}>
                    Add Product
                </button> */}
            </div>
            {uploaded ? (
                <>
                    <div>Product Information has been registered successfully!</div>
                    <div>Your token number is: {input.token}</div>
                </>
            ) : null}
        </>
    );
};

export default ManageProducts;
