import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { Web3Storage, File } from "web3.storage";

const Web3Upload = (props) => {
    const [info, setInfo] = useState([]);
    useEffect(() => {
        getInfo();
    }, []);
    const getInfo = async () => {
        try {
            const data = {
                body: {
                    username: props.username,
                },
            };
            const apiData = await API.post("productApi", "/products/updateWeb3Info", data);
            setInfo(apiData);
        } catch (error) {
            console.log(error.response);
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

    function makeFileObjects() {
        // You can create File objects from a Blob of binary data
        // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
        // Here we're just storing a JSON object, but you can store images,
        // audio, or whatever you want!
        const obj = { productInfo: info[0].brand_info };
        const number = Math.random();
        const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });

        const files = [new File(["contents-of-file-1"], "plain-utf8.txt"), new File([blob], `${number}test.json`)];
        return files;
    }

    async function storeFiles() {
        try {
            const client = makeStorageClient();
            let file = makeFileObjects();
            const cid = await client.put(file);
            console.log("stored files with cid:", cid);
            alert("Successfully stored filed with cid:" + cid);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {info.length !== 0
                ? info[0].brand_info.map((item, index) => {
                      return (
                          <div style={{ marginTop: "10px" }}>
                              <span>Brand {index + 1}</span>
                              <hr style={{ margin: "10px auto" }} />
                              <div className="ManagePages-card-right-content">
                                  <div className="ManagePages-card-right-content-title">Name</div>
                                  <div>{item.brand_name}</div>
                              </div>
                              <div className="ManagePages-card-right-content">
                                  <div className="ManagePages-card-right-content-title">Category</div>
                                  <div>{item.brand_category}</div>
                              </div>
                              {item.product_info.length === 0 ? (
                                  <div style={{ marginTop: "30px" }}>
                                      <div className="ManagePage-product">
                                          <div className="ManagePage-product-subtitle">Product details</div>
                                      </div>
                                      <hr style={{ margin: "10px auto" }} />
                                      <div>None</div>
                                  </div>
                              ) : (
                                  item.product_info.map((products, proIndex) => {
                                      return (
                                          <div style={{ marginTop: "30px" }}>
                                              <div className="ManagePage-product">
                                                  <div className="ManagePage-product-subtitle">
                                                      Product {proIndex + 1}
                                                  </div>
                                              </div>
                                              <hr style={{ margin: "10px auto" }} />
                                              <div className="ManagePages-card-right-content">
                                                  <div className="ManagePages-card-right-content-title">
                                                      Product Name
                                                  </div>
                                                  <div>{products.product_name}</div>
                                              </div>
                                              <div className="ManagePages-card-right-content">
                                                  <div className="ManagePages-card-right-content-title">
                                                      Specification
                                                  </div>
                                                  <div>{products.specification}</div>
                                              </div>
                                              <div className="ManagePages-card-right-content">
                                                  <div className="ManagePages-card-right-content-title">
                                                      Chemica Inputs
                                                  </div>
                                                  <div>{products.c_inputs}</div>
                                              </div>
                                              <div className="ManagePages-card-right-content">
                                                  <div className="ManagePages-card-right-content-title">Materials</div>
                                                  <div>{products.materials}</div>
                                              </div>
                                              <div className="ManagePages-card-right-content">
                                                  <div className="ManagePages-card-right-content-title">Practises</div>
                                                  <div>{products.practises}</div>
                                              </div>
                                          </div>
                                      );
                                  })
                              )}
                          </div>
                      );
                  })
                : null}
            <button className="ManagePages-btn right" style={{ marginLeft: "20px" }} onClick={storeFiles}>
                Web3.Storage Upload
            </button>
        </div>
    );
};

export default Web3Upload;
