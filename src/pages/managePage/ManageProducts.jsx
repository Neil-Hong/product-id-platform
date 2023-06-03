import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { Web3Storage } from "web3.storage";
import { tagChosed } from "../../redux/users/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { changeLoading } from "../../redux/users/productSlice";
import { ToastContainer, toast } from "react-toastify";

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
    // const [divNum, setDivNum] = useState(2);
    const [uploaded, setUploaded] = useState(false);
    const [showProduct, setShowProduct] = useState([]);
    const dispatch = useDispatch();
    const businessName = useSelector((state) => state.user.businessName);

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
                                    <div className="ManagePages-card-right-content-item">{item.product_name}</div>
                                </div>
                                <div className="ManagePages-card-right-content">
                                    <div className="ManagePages-card-right-content-title">Specification</div>
                                    <div className="ManagePages-card-right-content-item">{item.specification}</div>
                                </div>
                                <div className="ManagePages-card-right-content">
                                    <div className="ManagePages-card-right-content-title">Chemical Inputs</div>
                                    <div className="ManagePages-card-right-content-item">{item.c_inputs}</div>
                                </div>
                                <div className="ManagePages-card-right-content">
                                    <div className="ManagePages-card-right-content-title">Materials</div>
                                    <div className="ManagePages-card-right-content-item">{item.materials}</div>
                                </div>
                                <div className="ManagePages-card-right-content">
                                    <div className="ManagePages-card-right-content-title">Practises</div>
                                    <div className="ManagePages-card-right-content-item">{item.practises}</div>
                                </div>

                                {item.token.map((i, index) => (
                                    <div className="ManagePages-card-right-content">
                                        <div className="ManagePages-card-right-content-title">token {index + 1}</div>
                                        <div className="ManagePages-card-right-content-item">{i}</div>
                                    </div>
                                ))}
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

    useEffect(() => {
        getBrand();
    }, []);

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

    const addProducts = async () => {
        dispatch(changeLoading(true));
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
            const apiData = await API.post("productApi", "/products/addProducts", data);
            dispatch(changeLoading(false));
            // props.dispatch(tagChosed("manageproduct"));
            successNotify(apiData.message);
            // setTimeout(() => window.location.reload(), 5000);
        } catch (error) {
            notify(error.response.data.message);
            dispatch(changeLoading(false));
        }
    };

    const getBrand = async () => {
        dispatch(changeLoading(true));
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
            dispatch(changeLoading(false));
        } catch (error) {
            notify(error.response.data.message);
            dispatch(changeLoading(false));
        }
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

    const registerBrands = async (e) => {
        e.preventDefault();
        dispatch(changeLoading(true));
        const data = {
            body: {
                username: props.username,
                brand_name: input.brand_name,
                brand_category: input.brand_category,
                business_name: businessName,
            },
        };
        try {
            const apiData = await API.post("productApi", "/products/registerBrands", data);
            successNotify(apiData.message);
            props.dispatch(tagChosed("manageproduct"));
            dispatch(changeLoading(false));
            setTimeout(() => window.location.reload(), 5000);
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
            <div className="ManagePage-product-title">
                <span>Brand Details</span>
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
