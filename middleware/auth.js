const jwt = require('jsonwebtoken');
require('dotenv').config()
const {JWT_SECRET} = process.env
const { errorUnauthorized } = require("../utils/statusCodes");


const auth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return next(res.status(errorUnauthorized).send({
            message: "You are not authorized"
        }))
    }
    const token = authorization.replace("Bearer ", "");
    return jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err || decoded === undefined) {
            return next(res.status(errorUnauthorized).send({
                message: "Token not valid"
            }))
        }
        req.user = decoded;
        return next();
    });
}

module.exports = auth