const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../utils/config");
const { errorUnauthorized } = require("../utils/statusCodes");


const auth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return next(res.status(errorUnauthorized).send("You are not authorized"))
    }
    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
}

module.exports = auth