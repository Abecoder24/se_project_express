const jwt = require('jsonwebtoken');
require('dotenv').config()
const {JWT_SECRET} = process.env
const { errorUnauthorized } = require("../utils/statusCodes");
const handleErrors = require("../errors/error");


const auth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        next(new handleErrors('You are not authorized', errorUnauthorized));
    }
    const token = authorization.replace("Bearer ", "");
    return jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err || decoded === undefined) {
            next(new handleErrors("Token not valid", errorUnauthorized))
        }
        req.user = decoded;
        next();
    });
}

module.exports = auth