const jwt = require('jsonwebtoken');
const { errorUnauthorized } = require("../utils/statusCodes");
const HandleErrors = require("../errors/error");


require('dotenv').config()

const { JWT_SECRET = "super-strong-secret" } = process.env


const auth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        next(new HandleErrors('You are not authorized', errorUnauthorized));
    }
    const token = authorization.replace("Bearer ", "");
    return jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err || decoded === undefined) {
            next(new HandleErrors("Token not valid", errorUnauthorized))
        }
        req.user = decoded;
        next();
    });
}

module.exports = auth