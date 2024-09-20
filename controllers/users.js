const User = require("../models/user");
const { Error_Bad_Request, Error_Not_Found, Error_Internal_Server, Status_Ok, Status_Created } = require("./statusCodes");

const getUsers = (req, res) => {
    res.status(Status_Ok);
    User.find({})
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            console.error(err);
            return res.status(Error_Internal_Server).send({ message: err.message });
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
            return res.status(Error_Internal_Server).send({ message: err.message });
        })
}

const getUserById = (req, res) => {
    const { userId } = req.params;
    User.findById(userId)
        .orFail()
        .then(user => res.status(Status_Ok).send(user))
        .catch(err => {
            console.error(err);
            if (err.name == "DocumentNotFoundError") {
                return res.status(Error_Not_Found).send({ message: "User not Found" });
            } else if (err.name == "CastError") {
                return res.status(Error_Bad_Request).send({ message: "Bad Request" });
            }
            return res.status(Error_Internal_Server).send({ message: err.message });
        })
}

module.exports = { getUsers, createUser, getUserById };