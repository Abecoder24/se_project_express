const User = require("../models/user");
const { statusCreated, errorBadRequest, errorNotFound, errorInternalServer } = require("../utils/statusCodes");

const getUsers = (req, res) => {
    User.find({})
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            console.log(err);
            res.status(errorInternalServer).send({ message: 'Invalid data' });
        })
}

const createUser = (req, res) => {
    const { name, avatar } = req.body;

    User.create({ name, avatar })
        .then(user => res.status(statusCreated).send(user))
        .catch(err => {
            if (err.name === "ValidationError") {
                return res.status(errorBadRequest).send({ message: err.message })
            }
            return res.status(errorInternalServer).send({ message: 'Invalid data' });
        })
}

const getUserById = (req, res) => {
    const { userId } = req.params;
    User.findById(userId)
        .orFail()
        .then(user => res.send(user))
        .catch(err => {
            if (err.name === "DocumentNotFoundError") {
                return res.status(errorNotFound).send({ message: "User not Found" });
            }
            if (err.name === "CastError") {
                return res.status(errorBadRequest).send({ message: "Invalid User ID" });
            }
            return res.status(errorInternalServer).send({ message: 'Invalid data' });
        })
}

module.exports = { getUsers, createUser, getUserById };