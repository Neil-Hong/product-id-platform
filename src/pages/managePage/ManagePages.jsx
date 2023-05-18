import React, { useEffect, useState } from "react";
import "./ManagePages.style.scss";
import ManageAccount from "./ManageAccount";
import ManageProduct from "./ManageProduct";
import { Web3Storage, File } from "web3.storage";
import ViewReports from "./ViewReports";
import { API } from "aws-amplify";
import { useParams } from "react-router-dom";

const ManagePages = () => {
    const { id } = useParams();
    const [selected, setSelected] = useState("manageaccount");
    const [businessName, setBusinessName] = useState("");
    const handleButtonClick = (page) => {
        setSelected(page);
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
        const number = Math.random();
        const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });

        const files = [new File(["contents-of-file-1"], "plain-utf8.txt"), new File([blob], `${number}test.json`)];
        return files;
    }

    async function storeFiles(files) {
        try {
            const client = makeStorageClient();
            const cid = await client.put(files);
            console.log("stored files with cid:", cid);
            return cid;
        } catch (error) {
            console.log(error);
        }
    }

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
            setBusinessName(apiData);
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
                            {businessName ? <h2>{businessName}</h2> : <h2>Veritas-ID Platform</h2>}
                        </div>
                        <div className="ManagePages-card-top-item"></div>
                    </div>
                    <div className="ManagePages-card-bottom">
                        {" "}
                        <div className="ManagePages-card-left">
                            <button
                                className="ManagePages-btn"
                                onClick={() => {
                                    handleButtonClick("manageaccount");
                                }}
                            >
                                Manage Account
                            </button>

                            <button
                                className="ManagePages-btn"
                                onClick={() => {
                                    handleButtonClick("manageproduct");
                                }}
                            >
                                Manage Products
                            </button>
                            <button
                                className="ManagePages-btn"
                                onClick={() => {
                                    handleButtonClick("viewreport");
                                }}
                            >
                                View Reports
                            </button>
                        </div>
                        <div className="ManagePages-card-right">
                            {selected === "manageaccount" ? <ManageAccount /> : null}
                            {selected === "manageproduct" ? (
                                <ManageProduct storeFile={storeFiles} makeFile={makeFileObjects} />
                            ) : null}
                            {selected === "viewreport" ? <ViewReports /> : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagePages;
