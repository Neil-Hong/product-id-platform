import React, { useEffect, useState } from "react";
import "./ManagePages.style.scss";
import ManageAccount from "./ManageAccount";
import ManageProducts from "./ManageProducts";
import ViewReports from "./ViewReports";
import { API } from "aws-amplify";
import { useParams } from "react-router-dom";
import Web3Upload from "./Web3Upload";
import { useDispatch, useSelector } from "react-redux";
import { tagChosed } from "../../redux/users/userSlice";

const ManagePages = () => {
    const { id } = useParams();
    const [business, setBusiness] = useState({});
    const tagSelected = useSelector((state) => state.user.tag);
    console.log(tagSelected);
    const dispatch = useDispatch();
    const handleButtonClick = (page) => {
        // setSelected(page);
        dispatch(tagChosed(page));
    };

    const scrollAnimate = () => {
        var scroll =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            // IE Fallback, you can even fallback to onscroll
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
        var elementsToShow = document.querySelectorAll(".ManagePages-card-right");

        function loop() {
            elementsToShow.forEach(function (element) {
                if (isElementInViewport(element)) {
                    element.classList.add("scale-in-hor-center");
                } else {
                    element.classList.remove("scale-in-hor-center");
                }
            });

            scroll(loop);
        }

        // Call the loop for the first time
        loop();
        // Helper function from: http://stackoverflow.com/a/7557433/274826
        function isElementInViewport(el) {
            var rect = el.getBoundingClientRect();
            return (
                (rect.top <= 0 && rect.bottom >= 0) ||
                (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
                    rect.top <= (window.innerHeight || document.documentElement.clientHeight)) ||
                (rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
            );
        }
    };

    useEffect(() => {
        getBusinessName();
        // scrollAnimate();
    }, []);

    const getBusinessName = async () => {
        try {
            const data = {
                body: {
                    username: id,
                },
            };
            const apiData = await API.post("productApi", "/products/getBusinessName", data);
            setBusiness(apiData);
        } catch (error) {
            console.log(error.response);
        }
    };
    return (
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
                            {/* <button
                                className={`ManagePages-btn ${tagSelected === "managebrand" ? "selected" : ""}`}
                                onClick={() => {
                                    handleButtonClick("managebrand");
                                }}
                            >
                                Manage Brands
                            </button> */}

                            <button
                                className={`ManagePages-btn ${tagSelected === "manageproduct" ? "selected" : ""}`}
                                onClick={() => {
                                    handleButtonClick("manageproduct");
                                }}
                            >
                                Manage Products
                            </button>
                            <button
                                className={`ManagePages-btn ${tagSelected === "viewreport" ? "selected" : ""}`}
                                onClick={() => {
                                    handleButtonClick("viewreport");
                                }}
                            >
                                View Reports
                            </button>
                            <button
                                className={`ManagePages-btn ${tagSelected === "web3" ? "selected" : ""}`}
                                onClick={() => {
                                    handleButtonClick("web3");
                                }}
                            >
                                Co2.Storage
                            </button>
                        </div>
                        <div className="ManagePages-card-right">
                            {tagSelected === "manageaccount" ? (
                                <ManageAccount receivedBusiness={business} username={id} />
                            ) : null}
                            {/* {tagSelected === "managebrand" ? (
                                <ManageBrand username={id} businessName={business.businessName} />
                            ) : null} */}
                            {tagSelected === "manageproduct" ? (
                                <ManageProducts
                                    username={id}
                                    businessName={business.businessName}
                                    dispatch={dispatch}
                                />
                            ) : null}
                            {tagSelected === "viewreport" ? <ViewReports /> : null}
                            {tagSelected === "web3" ? <Web3Upload username={id} /> : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagePages;
