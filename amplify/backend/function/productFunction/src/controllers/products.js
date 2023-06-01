const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

const checkBusinessName = (name) => {
    if (!name) {
        return false;
    }
    return true;
};

const registerBusiness = async (req, res) => {
    const { username, business_name, address, website } = req.body;

    var scanParams = {
        TableName: "userTable-dev",
        FilterExpression: "#username = :usernameValue",
        ExpressionAttributeNames: {
            "#username": "username",
        },
        ExpressionAttributeValues: {
            ":usernameValue": username,
        },
    };
    if (!checkBusinessName(business_name)) {
        res.status(400).send({ message: "Business name cannot be empty!" });
    } else {
        await docClient.scan(scanParams, async function (err, data) {
            if (err) {
                res.json({ err });
            } else {
                console.log(data.Items);
                if (data.Items.length > 0) {
                    var params = {
                        TableName: "userTable-dev",
                        Key: { id: data.Items[0].id },
                        UpdateExpression: "SET business_info = :info",
                        ExpressionAttributeValues: {
                            ":info": [
                                {
                                    business_name: business_name,
                                    address: address,
                                    website: website,
                                    brand_info: [],
                                },
                            ],
                        },
                        ReturnValues: "UPDATED_NEW",
                    };
                    await docClient.update(params, function (err, data) {
                        if (err) {
                            res.json({ err });
                        } else {
                            res.send({ message: "Successfully Registered!" });
                        }
                    });
                }
            }
        });
    }
};

const updateBusiness = async (req, res) => {
    const { username, business_name, address, website } = req.body;

    var scanParams = {
        TableName: "userTable-dev",
        FilterExpression: "#username = :usernameValue",
        ExpressionAttributeNames: {
            "#username": "username",
        },
        ExpressionAttributeValues: {
            ":usernameValue": username,
        },
    };
    if (!checkBusinessName(business_name)) {
        res.status(400).send({ message: "Business name cannot be empty!" });
    } else {
        await docClient.scan(scanParams, async function (err, data) {
            if (err) {
                res.json({ err });
            } else {
                if (data.Items.length > 0) {
                    const getParams = {
                        TableName: "userTable-dev",
                        Key: { id: data.Items[0].id },
                    };

                    await docClient.get(getParams, (err, data) => {
                        if (err) {
                            console.error("Error retrieving item:", err);
                        } else {
                            const updateParams = {
                                TableName: "userTable-dev",
                                Key: { id: data.Item.id },
                                UpdateExpression:
                                    "SET business_info[0].business_name = :businessName, business_info[0].address = :businessAddress,business_info[0].website = :businessWebsite",
                                ExpressionAttributeValues: {
                                    ":businessName": business_name,
                                    ":businessAddress": address,
                                    ":businessWebsite": website,
                                },
                                ReturnValues: "ALL_NEW",
                            };

                            docClient.update(updateParams, (err, data) => {
                                if (err) {
                                    res.json({ err });
                                } else {
                                    res.send({ message: "Business update Successfully!" });
                                }
                            });
                        }
                    });
                }
            }
        });
    }
};

const registerBrands = async (req, res) => {
    const { username, brand_name, brand_category, business_name } = req.body;
    const checkBrandName = (name) => {
        if (!name || name[0] === "") {
            return false;
        }
        return true;
    };
    var scanParams = {
        TableName: "userTable-dev",
        FilterExpression: "#username = :usernameValue",
        ExpressionAttributeNames: {
            "#username": "username",
        },
        ExpressionAttributeValues: {
            ":usernameValue": username,
        },
    };
    if (!checkBrandName(brand_name)) {
        res.status(400).send({ message: "Brand name cannot be empty!" });
    } else {
        await docClient.scan(scanParams, async function (err, data) {
            if (err) {
                res.json({ err });
            } else {
                const getParams = {
                    TableName: "userTable-dev",
                    Key: { id: data.Items[0].id },
                };
                docClient.get(getParams, (err, data) => {
                    if (err) {
                        console.error("Error retrieving item:", err);
                    } else {
                        const businessInfoToUpdate = data.Item.business_info.find(
                            (info) => info.business_name === business_name
                        );
                        console.log(businessInfoToUpdate);
                        if (businessInfoToUpdate) {
                            businessInfoToUpdate.brand_info.push({
                                brand_name: brand_name,
                                brand_category: brand_category,
                                product_info: [],
                            });

                            const updateParams = {
                                TableName: "userTable-dev",
                                Key: { id: data.Item.id },
                                UpdateExpression: "SET business_info = :businessInfo",
                                ExpressionAttributeValues: {
                                    ":businessInfo": data.Item.business_info,
                                },
                                ReturnValues: "ALL_NEW",
                            };

                            docClient.update(updateParams, (err, data) => {
                                if (err) {
                                    res.json({ err });
                                } else {
                                    res.send({ message: "Brand register Successfully!" });
                                }
                            });
                        }
                    }
                });
            }
        });
    }
};

const getBusinessName = async (req, res) => {
    const { username } = req.body;
    var params = {
        TableName: "userTable-dev",
        FilterExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": username,
        },
    };
    await docClient.scan(params, function (err, data) {
        if (err) {
            res.json({ err });
        } else {
            if (data.Items.length > 0) {
                if (data.Items[0].business_info.length > 0) {
                    const result = {
                        businessName: data.Items[0].business_info[0].business_name,
                        businessWebsite: data.Items[0].business_info[0].website,
                        businessAddress: data.Items[0].business_info[0].address,
                    };
                    res.send(result);
                } else {
                    const emptyResult = {
                        businessName: "",
                        businessWebsite: "",
                        businessAddress: "",
                    };
                    res.send(emptyResult);
                }
            }
        }
    });
};

const getBrandName = async (req, res) => {
    const { username } = req.body;
    var params = {
        TableName: "userTable-dev",
        FilterExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": username,
        },
    };
    await docClient.scan(params, function (err, data) {
        if (err) {
            res.json({ err });
        } else {
            if (data.Items.length > 0) {
                if (data.Items[0].business_info.length === 0) {
                    res.status(400).send({ message: "Please register business first!" });
                } else {
                    if (data.Items[0].business_info[0].business_name === "") {
                        res.status(400).send({ message: "Please register business first!" });
                    } else {
                        const result = {
                            brandName: data.Items[0].business_info[0].brand_info,
                        };
                        res.send(result);
                    }
                }
            }
        }
    });
};

const addProducts = async (req, res) => {
    const { username, brand_name, product_name, specification, materials, practises, c_inputs, token } = req.body;
    const checkBrandName = (name) => {
        if (!name || name === "") {
            return false;
        }
        return true;
    };
    const checkProductName = (name) => {
        for (let i = 0; i < name.length; i++) {
            if (!name[i] || name[i] === "") {
                return false;
            }
        }
        return true;
    };
    var params = {
        TableName: "userTable-dev",
        FilterExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": username,
        },
    };
    if (!checkBrandName(brand_name)) {
        res.status(400).send({ message: "Please select a brand name!" });
    } else if (!checkProductName(product_name)) {
        res.status(400).send({ message: "Product Name cannot be empty!" });
    } else {
        await docClient.scan(params, async function (err, data) {
            if (err) {
                res.json({ err });
            } else {
                if (data.Items.length > 0) {
                    const getParams = {
                        TableName: "userTable-dev",
                        Key: { id: data.Items[0].id },
                    };

                    await docClient.get(getParams, (err, data) => {
                        if (err) {
                            console.error("Error retrieving item:", err);
                        } else {
                            // console.log(data.Item.business_info[0].brand_info);
                            const productsInfoToUpdate = data.Item.business_info[0].brand_info.find(
                                (info) => info.brand_name === brand_name
                            );
                            const newToken = [];
                            for (let i = 0; i < token.length; i++) {
                                if (newToken.indexOf(token[i]) === -1) {
                                    newToken.push(token[i]);
                                }
                            }
                            console.log(productsInfoToUpdate);
                            console.log(newToken);
                            const checkProduct = productsInfoToUpdate.product_info.find(
                                (item) => item.product_name === product_name
                            );
                            console.log(checkProduct);
                            if (checkProduct) {
                                checkProduct.c_inputs = c_inputs;
                                checkProduct.materials = materials;
                                checkProduct.specification = specification;
                                checkProduct.practises = practises;
                                checkProduct.token = newToken;
                            } else {
                                if (productsInfoToUpdate) {
                                    productsInfoToUpdate.product_info.push({
                                        product_name: product_name,
                                        specification: specification,
                                        materials: materials,
                                        practises: practises,
                                        c_inputs: c_inputs,
                                        token: newToken,
                                    });
                                }
                            }
                            const updateParams = {
                                TableName: "userTable-dev",
                                Key: { id: data.Item.id },
                                UpdateExpression: "SET business_info = :businessInfo",
                                ExpressionAttributeValues: {
                                    ":businessInfo": data.Item.business_info,
                                },
                                ReturnValues: "ALL_NEW",
                            };

                            docClient.update(updateParams, (err, data) => {
                                if (err) {
                                    res.json({ err });
                                } else {
                                    res.send({ message: "Products register Successfully!" });
                                }
                            });
                        }
                    });
                }
            }
        });
    }
};

const getItem = async (req, res) => {
    const { username } = req.body;
    var scanParams = {
        TableName: "userTable-dev",
        FilterExpression: "#username = :usernameValue",
        ExpressionAttributeNames: {
            "#username": "username",
        },
        ExpressionAttributeValues: {
            ":usernameValue": username,
        },
    };
    docClient.scan(scanParams, async function (err, data) {
        if (err) {
            res.json({ err });
        } else {
            const result = data.Items[0];
            res.send(result);
        }
    });
};

const addCo2Token = async (req, res) => {
    const { username, token } = req.body;
    var params = {
        TableName: "userTable-dev",
        FilterExpression: "#username = :usernameValue",
        ExpressionAttributeNames: {
            "#username": "username",
        },
        ExpressionAttributeValues: {
            ":usernameValue": username,
        },
    };
    await docClient.scan(params, async function (err, data) {
        if (err) {
            res.json({ err });
        } else {
            if (data.Items.length > 0) {
                const getParams = {
                    TableName: "userTable-dev",
                    Key: { id: data.Items[0].id },
                };
                await docClient.get(getParams, (err, data) => {
                    if (err) {
                        console.error("Error retrieving item:", err);
                    } else {
                        console.log(data.Item.business_info[0].brand_info);
                        data.Item.co2_token.push(token);
                        const updateParams = {
                            TableName: "userTable-dev",
                            Key: { id: data.Item.id },
                            UpdateExpression: "SET co2_token= :tokenValue",
                            ExpressionAttributeValues: {
                                ":tokenValue": data.Item.co2_token,
                            },
                            ReturnValues: "ALL_NEW",
                        };

                        docClient.update(updateParams, (err, data) => {
                            if (err) {
                                res.json({ err });
                            } else {
                                res.send({ message: "Products register Successfully!" });
                            }
                        });
                    }
                });
            }
        }
    });
};

const products = {
    registerBusiness: registerBusiness,
    getBusinessName: getBusinessName,
    registerBrands: registerBrands,
    getBrandName: getBrandName,
    addProducts: addProducts,
    getItem: getItem,
    updateBusiness: updateBusiness,
    addCo2Token: addCo2Token,
};
module.exports = products;
