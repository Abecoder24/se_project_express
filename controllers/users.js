const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const { statusCreated, errorBadRequest, errorNotFound, errorInternalServer } = require("../utils/statusCodes");
const { JWT_SECRET } = require('../utils/config');

// const getUsers = (req, res) => {
//     User.find({})
//         .then(users => {
//             res.send(users)
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(errorInternalServer).send({ message: 'Invalid data' });
//         })
// }


const getCurrentUser = (req, res) => {
    User.findOne({ _id: req.user._id }).orFail()
        .then(user => res.send(user))
        .catch(err => {
            if (err.name === "DocumentNotFoundError") {
                return res.status(errorNotFound).send({ message: "User not Found" });
            }
            if (err.name === "CastError") {
                return res.status(errorBadRequest).send({ message: "Invalid User ID" });
            }
            return res.status(errorInternalServer).send({ message: 'Unable to handle the request' });
        })
}

const updateCurrentUser = (req, res) => {
    const { _id } = req.user;
    const { name, avatar } = req.body;

    User.findByIdAndUpdate(_id, {
        $set: {
            name,
            avatar
        }
    },
        {
            new: true,
            runValidators: true
        })
        .then(user => res.status(statusCreated).send(user))
        .catch(err => {
            if (err.name === "ValidationError") {
                return res.status(errorBadRequest).send({ message: err.message })
            }
            if (err.name === "DocumentNotFoundError") {
                return res.status(errorNotFound).send({ message: "User not Found" });
            }
            return res.status(errorInternalServer).send({ message: 'An error has occurred on the server' });
        })
}

const createUser = (req, res) => {
    const { name, avatar, email, password } = req.body;
    return bcryptjs.hash(password, 10)
        .then(hashedPassword => User.create({
            name,
            avatar,
            email,
            password: hashedPassword
        })
            .then(user => res.status(statusCreated).send(user))
            .catch(err => {
                if (err.name === "ValidationError") {
                    return res.status(errorBadRequest).send({ message: err.message })
                }
                if (err.code === 11000) {
                    return res.status(errorBadRequest).send({ message: "Email address already exists" })
                }
                return res.status(errorInternalServer).send({ message: 'An error has occurred on the server' });
            }))

}

const login = (req, res) => {
    const { email, password } = req.body;
    User.findUserByCredentials(email, password)
        .then(user => {
            const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
            res.send({
                token
            })
        })
        .catch(err => res.status(401).send({
            message: err.message
        }))
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

module.exports = { login, createUser, getUserById, getCurrentUser, updateCurrentUser };