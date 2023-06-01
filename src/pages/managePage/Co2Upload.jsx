import { API } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { RiEdit2Fill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { changeLoading, setCo2Token } from "../../redux/users/productSlice";
const Co2Upload = (props) => {
    const [input, setInput] = useState({
        electricity: 0,
        cutton_fibres: 0,
        bleach: 0,
        waste_water: 0,
        electricity_co2: 0,
        cutton_fibres_co2: 0,
        bleach_co2: 0,
        waste_water_co2: 0,
    });
    const [token, setToken] = useState(null);
    const [editing, setEditing] = useState(true);
    const [co2Data, setCo2Data] = useState({
        electricity: null,
        cutton_fibres: null,
        bleach: null,
        waste_water: null,
    });
    const dispatch = useDispatch();
    const handleChange = (e) => {
        const { name, value } = e.target;
        e.preventDefault();

        const floatValue = parseFloat(value);
        if (name === "electricity") {
            setInput((prev) => ({
                ...prev,
                [name]: floatValue,
                electricity_co2: (floatValue * 0.64).toFixed(2),
            }));
        } else if (name === "cutton_fibres") {
            setInput((prev) => ({
                ...prev,
                [name]: floatValue,
                cutton_fibres_co2: (floatValue * 2.95).toFixed(2),
            }));
        } else if (name === "bleach") {
            setInput((prev) => ({
                ...prev,
                [name]: floatValue,
                bleach_co2: (floatValue * 1.18).toFixed(2),
            }));
        } else if (name === "waste_water") {
            setInput((prev) => ({
                ...prev,
                [name]: floatValue,
                waste_water_co2: 0,
            }));
        } else {
            setInput((prev) => ({ ...prev, [name]: floatValue }));
        }
    };

    const { fgStorage } = props;

    useEffect(() => {
        getAssetData();
    }, []);

    const getAssetData = async () => {
        dispatch(changeLoading(true));
        const data = {
            body: {
                username: props.username,
            },
        };
        const apiData = await API.post("productApi", "/products/getItem", data);
        if (apiData && apiData.co2_token.length !== 0) {
            const co2Token = apiData.co2_token[apiData.co2_token.length - 1];
            try {
                let searchAssetsResponse = await fgStorage.searchAssets("sandbox", null, co2Token); // ('SP Audits', 'Water')
                const lastListedAsset =
                    searchAssetsResponse.result.assets[searchAssetsResponse.result.assets.length - 1];
                if (lastListedAsset) {
                    try {
                        let getAssetResponse = await fgStorage.getAsset(lastListedAsset.block);
                        console.log(getAssetResponse.result.asset, { depth: null });
                        setCo2Data({
                            electricity: getAssetResponse.result.asset[2].Electricity,
                            cutton_fibres: getAssetResponse.result.asset[4]["Cotton Fibres"],
                            bleach: getAssetResponse.result.asset[0].Bleach,
                            waste_water: getAssetResponse.result.asset[6]["Waste Water"],
                        });
                    } catch (error) {
                        console.log(error);
                        // dispatch(changeLoading(false));
                    }
                }
                dispatch(changeLoading(false));
            } catch (error) {
                console.log(error);
                dispatch(changeLoading(false));
            }
        } else {
            dispatch(changeLoading(false));
        }
        dispatch(changeLoading(false));
    };
    async function addAsset() {
        dispatch(changeLoading(true));
        const assetElements = [
            {
                name: "Bleach",
                value: input.bleach,
            },
            {
                name: "Bleach_Co2",
                value: input.bleach_co2,
            },
            {
                name: "Electricity",
                value: input.electricity,
            },
            {
                name: "Electricity_Co2",
                value: input.electricity_co2,
            },
            {
                name: "Cotton Fibres",
                value: input.cutton_fibres,
            },
            {
                name: "Cotton Fibres_Co2",
                value: input.cutton_fibres_co2,
            },
            {
                name: "Waste Water",
                value: input.waste_water,
            },
            {
                name: "Waste Water_Co2",
                value: input.waste_water_co2,
            },
        ];
        let addAssetResponse = await fgStorage.addAsset(
            assetElements,
            {
                parent: null,
                name: "Veritas-id-Co2 Calculation demo",
                description: "Veritas Co2 Calculation demo",
                template: "bafyreifxjblnmcvgeycw7pud52cn5yoyp2a2cf2hos4dpyyj4vu743k2am", // CID of above template
                filesUploadStart: () => {
                    console.log("Upload started");
                },
                filesUploadEnd: () => {
                    console.log("Upload finished");
                },
                createAssetStart: () => {
                    console.log("Creating asset");
                },
                createAssetEnd: () => {
                    console.log("Asset created");
                },
            },
            "sandbox"
        );

        if (addAssetResponse.error != null) {
            console.log(addAssetResponse.error);
            dispatch(changeLoading(false));
        }

        console.log(addAssetResponse.result, { depth: null });
        setToken(addAssetResponse.result.block);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        dispatch(changeLoading(false));
        const data = {
            body: {
                token: addAssetResponse.result.block,
                username: props.username,
            },
        };
        const apiData = await API.post("productApi", "/products/uploadCo2Token", data);
        setEditing(true);
        dispatch(setCo2Token(addAssetResponse.result.block));
        dispatch(changeLoading(false));
    }
    const handleEdit = () => {
        setEditing(false);
    };
    // console.log(input);
    console.log(co2Data);
    return (
        <div>
            <span>Manufacture Data</span>
            <RiEdit2Fill onClick={handleEdit} style={{ cursor: "pointer" }} />
            <hr style={{ margin: "10px auto" }} />
            <div>
                <div className="ManagePages-card-right-content">
                    <div className="ManagePages-card-right-content-title">Electricity</div>
                    {co2Data.electricity && editing ? (
                        <div>{co2Data.electricity}</div>
                    ) : (
                        <input
                            className="ManagePages-card-right-content-number"
                            name="electricity"
                            type="number"
                            onChange={handleChange}
                        />
                    )}
                    <div style={{ marginLeft: "10px" }}>kWh</div>
                </div>
                <div className="ManagePages-card-right-content">
                    <div className="ManagePages-card-right-content-title">Cotton Fibres</div>
                    {co2Data.electricity && editing ? (
                        <div>{co2Data.cutton_fibres}</div>
                    ) : (
                        <input
                            className="ManagePages-card-right-content-number"
                            name="cutton_fibres"
                            type="number"
                            onChange={handleChange}
                        />
                    )}

                    <div style={{ marginLeft: "10px" }}>kg</div>
                </div>
                <div className="ManagePages-card-right-content">
                    <div className="ManagePages-card-right-content-title">Bleach</div>
                    {co2Data.electricity && editing ? (
                        <div>{co2Data.bleach}</div>
                    ) : (
                        <input
                            className="ManagePages-card-right-content-number"
                            name="bleach"
                            type="number"
                            onChange={handleChange}
                        />
                    )}
                    <div style={{ marginLeft: "10px" }}>kg</div>
                </div>

                <div className="ManagePages-card-right-content">
                    <div className="ManagePages-card-right-content-title">Waster Water</div>
                    {co2Data.electricity && editing ? (
                        <div>{co2Data.waste_water}</div>
                    ) : (
                        <input
                            className="ManagePages-card-right-content-number"
                            name="waste_water"
                            type="number"
                            onChange={handleChange}
                        />
                    )}

                    <div style={{ marginLeft: "10px" }}>kg</div>
                </div>
            </div>

            <button className="ManagePages-btn right" style={{ width: "200px" }} onClick={addAsset}>
                Submit to Co2.Storage
            </button>

            {token ? (
                <>
                    <div>Data uploaded to Co2.Storage Successfully!</div>
                    <div>Your Token is: {token}</div>
                </>
            ) : null}
        </div>
    );
};

export default Co2Upload;
