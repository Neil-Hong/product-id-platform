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
                console.log("before" + data.Items[0].business_info[0].business_name);
                // if (data.Items.length > 0) {
                //     var params = {
                //         TableName: "userTable-dev",
                //         Key: { id: data.Items[0].id },
                //         UpdateExpression:
                //             "SET business_info[0].brand_info = list_append(business_info[0].brand_info, :newBrandInfo)",
                //         ExpressionAttributeValues: {
                //             ":newBrandInfo": [
                //                 {
                //                     brand_name: brand_name,
                //                     category: brand_category,
                //                     product_info: [],
                //                 },
                //             ],
                //         },
                //         ReturnValues: "ALL_NEW",
                //     };
                //     await docClient.update(params, function (err, data) {
                //         if (err) {
                //             res.json({ err });
                //         } else {
                //             console.log(data);
                //             console.log(data.Items[0]);
                //             res.send({ message: "Successfully Registered!" });
                //         }
                //     });
                // }
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
                            for (let i = 0; i < brand_name.length; i++) {
                                businessInfoToUpdate.brand_info.push({
                                    brand_name: brand_name[i],
                                    brand_category: brand_category[i],
                                    product_info: [],
                                });
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
                const result = {
                    businessName: data.Items[0].business_info[0].business_name,
                    businessWebsite: data.Items[0].business_info[0].website,
                    businessAddress: data.Items[0].business_info[0].address,
                };
                res.send(result);
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
                const result = {
                    brandName: data.Items[0].business_info[0].brand_info,
                };
                res.send(result);
            }
        }
    });
};

const addProducts = async (req, res) => {
    const { username, brand_name, product_name, specification, materials, practises, c_inputs } = req.body;
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
                            console.log(data.Item.business_info[0].brand_info);
                            const productsInfoToUpdate = data.Item.business_info[0].brand_info.find(
                                (info) => info.brand_name === brand_name
                            );
                            if (productsInfoToUpdate) {
                                for (let i = 0; i < product_name.length; i++) {
                                    productsInfoToUpdate.product_info.push({
                                        product_name: product_name[i],
                                        specification: specification[i],
                                        materials: materials[i],
                                        practises: practises[i],
                                        c_inputs: c_inputs[i],
                                    });
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
                        }
                    });
                }
            }
        });
    }
};

const updateWeb3Info = async (req, res) => {
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
            const result = data.Items[0].business_info;
            res.send(result);
        }
    });
};

const products = {
    registerBusiness: registerBusiness,
    getBusinessName: getBusinessName,
    registerBrands: registerBrands,
    getBrandName: getBrandName,
    addProducts: addProducts,
    updateWeb3Info: updateWeb3Info,
};
module.exports = products;
