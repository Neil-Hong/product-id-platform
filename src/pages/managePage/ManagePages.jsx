import React, { useMemo } from "react";
import "./ManagePages.style.scss";
import ManageAccount from "./ManageAccount";
import ManageProducts from "./ManageProducts";
import ViewReports from "./ViewReports";
import { FGStorage } from "@co2-storage/js-api";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { tagChosed } from "../../redux/users/userSlice";
import Co2Upload from "./Co2Upload";

const ManagePages = () => {
    const { id } = useParams();
    const tagSelected = useSelector((state) => state.user.tag);
    const dispatch = useDispatch();
    const handleButtonClick = (page) => {
        dispatch(tagChosed(page));
    };

    const authType = "metamask";
    const ipfsNodeType = "browser";
    const ipfsNodeAddr = "/dns4/web2.co2.storage/tcp/5002/https";
    const fgApiUrl = "https://web2.co2.storage";

    const fgStorage = useMemo(() => {
        return new FGStorage({
            authType: authType,
            ipfsNodeType: ipfsNodeType,
            ipfsNodeAddr: ipfsNodeAddr,
            fgApiHost: fgApiUrl,
        });
    }, []);
    return (
        <>
            <div className="ManagePages-container">
                <div className="ManagePages-card-wrapper">
                    <div className="ManagePages-card">
                        <div className="ManagePages-card-top">
                            <div className="ManagePages-card-top-item">
                                <img src="/img/V-ID-Logo.webp" alt="logo" />
                            </div>
                            <div className="ManagePages-card-top-item">
                                <h2>Veritas-ID Platform</h2>
                            </div>
                            <div className="ManagePages-card-top-item"></div>
                        </div>
                        <div className="ManagePages-card-bottom">
                            {" "}
                            <div className="ManagePages-card-left">
                                <button
                                    className={`ManagePages-btn ${tagSelected === "manageaccount" ? "selected" : ""}`}
                                    onClick={() => {
                                        handleButtonClick("manageaccount");
                                    }}
                                >
                                    Manage Account
                                </button>

                                <button
                                    className={`ManagePages-btn ${tagSelected === "manageproduct" ? "selected" : ""}`}
                                    onClick={() => {
                                        handleButtonClick("manageproduct");
                                    }}
                                >
                                    Manage Products
                                </button>
                                <button
                                    className={`ManagePages-btn ${tagSelected === "co2" ? "selected" : ""}`}
                                    onClick={() => {
                                        handleButtonClick("co2");
                                    }}
                                >
                                    Co2.Storage
                                </button>
                                <button
                                    className={`ManagePages-btn ${tagSelected === "viewreport" ? "selected" : ""}`}
                                    onClick={() => {
                                        handleButtonClick("viewreport");
                                    }}
                                >
                                    View Reports
                                </button>
                            </div>
                            <div className="ManagePages-card-right">
                                {tagSelected === "manageaccount" ? <ManageAccount username={id} /> : null}
                                {tagSelected === "manageproduct" ? (
                                    <ManageProducts username={id} dispatch={dispatch} />
                                ) : null}
                                {tagSelected === "viewreport" ? (
                                    <ViewReports fgStorage={fgStorage} username={id} />
                                ) : null}
                                {tagSelected === "co2" ? <Co2Upload username={id} fgStorage={fgStorage} /> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManagePages;
