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
                        UpdateExpression:
                            "SET #nameAttr = :nameValue, #addressAttr = :addressValue, #websiteAttr = :websiteValue",
                        ExpressionAttributeNames: {
                            "#nameAttr": "business_name",
                            "#addressAttr": "address",
                            "#websiteAttr": "website",
                        },
                        ExpressionAttributeValues: {
                            ":nameValue": business_name,
                            ":addressValue": address,
                            ":websiteValue": website,
                        },
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
                res.send(data.Items[0].business_name);
            }
        }
    });
};

const products = {
    registerBusiness: registerBusiness,
    getBusinessName: getBusinessName,
};
module.exports = products;
