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

    return (
        <div>
            {/* {info.length !== 0
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
            </button> */}
        </div>
    );
};

export default Web3Upload;
