const User = require("../models/user");
const { Error_Bad_Request, Error_Not_Found, Error_Internal_Server, Status_Created } = require("../utils/statusCodes");

const getUsers = (req, res) => {
    User.find({})
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            console.error(err);
            return res.status(Error_Internal_Server).send({ message: 'Invalid data' });
        })
}

const createUser = (req, res) => {
    const { name, avatar } = req.body;

    User.create({ name, avatar })
        .then(user => res.status(Status_Created).send(user))
        .catch(err => {
            if (err.name === "ValidationError") {
                return res.status(Error_Bad_Request).send({ message: err.message })
            }
            return res.status(Error_Internal_Server).send({ message: 'Invalid data' });
        })
}

const getUserById = (req, res) => {
    const { userId } = req.params;
    User.findById(userId)
        .orFail()
        .then(user => res.send(user))
        .catch(err => {
            console.error(err);
            if (err.name == "DocumentNotFoundError") {
                return res.status(Error_Not_Found).send({ message: "User not Found" });
            } else if (err.name == "CastError") {
                return res.status(Error_Bad_Request).send({ message: "Bad Request" });
            }
            return res.status(Error_Internal_Server).send({ message: 'Invalid data' });
        })
}

module.exports = { getUsers, createUser, getUserById };