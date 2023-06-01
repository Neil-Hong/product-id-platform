const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const docClient = new AWS.DynamoDB.DocumentClient();

const emailIsValid = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const passwordIsValid = (password) => {
    if (!password) {
        return false;
    }
    if (password.length < 6) {
        return false;
    }
    if (!/[A-Z]/.test(password)) {
        return false;
    }
    return true;
};

const usernameIsValid = (username) => {
    if (!username) {
        return false;
    }
    if (username.length < 6) {
        return false;
    }
    return true;
};

function id() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

const register = async (req, res) => {
    const { username, email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    var params = {
        TableName: "userTable-dev",
        FilterExpression: "username = :username OR email = :email",
        ExpressionAttributeValues: {
            ":username": username,
            ":email": email,
        },
    };
    if (!emailIsValid(email)) {
        res.status(400).send({ message: "Email is invalid, please input valid email address!" });
    } else if (!usernameIsValid(username)) {
        res.status(400).send({ message: "Username is invalid! Must have at least 6 characters." });
    } else if (!passwordIsValid(password)) {
        res.status(400).send({ message: "Password is invalid! Must have at least 6 characters and 1 Capital letter." });
    } else {
        await docClient.scan(params, async (err, data) => {
            if (err) {
                res.json({ err });
            } else {
                if (data.Items.length > 0) {
                    res.status(409).send({ message: "Email or username already registered!" });
                } else {
                    var inputParams = {
                        TableName: "userTable-dev",
                        Item: {
                            id: id(),
                            username: username,
                            email: email,
                            password: hash,
                            business_info: [],
                            co2_token: [],
                        },
                    };
                    await docClient.put(inputParams, function (err, data) {
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

const checkPassword = async (password, hash) => {
    const result = await bcrypt.compare(password, hash);
    return result;
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const loginParam = {
        TableName: "userTable-dev",
        FilterExpression: "username = :username",
        ExpressionAttributeValues: {
            ":username": username,
        },
    };
    docClient.scan(loginParam, async (err, data) => {
        if (err) {
            res.json({ err });
        } else {
            console.log(data.Items);
            if (data.Items.length === 0) {
                res.status(401).send({ message: "User not found, please try again!" });
            } else if (!(await checkPassword(password, data.Items[0].password))) {
                res.status(401).send({ message: "Wrong username or password!" });
            } else {
                const token = jwt.sign({ userId: data.Items[0].id }, "jwtkey");
                console.log(token);
                res.set("Set-Cookie", `access_token=${token}; HttpOnly; Secure; SameSite=None`);
                res.send({ message: "Login Successfully!" });
            }
        }
    });
};

const auth = {
    register: register,
    login: login,
};

module.exports = auth;
