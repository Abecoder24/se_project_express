const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const { statusCreated, errorBadRequest, errorNotFound, errorInternalServer, errorDuplicate, errorUnauthorized } = require("../utils/statusCodes");
require('dotenv').config()
const {JWT_SECRET = "key-from-default-value"} = process.env


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
            .then(user => res.status(statusCreated).send({
                user: {
                    name: user.name,
                    avatar: user.avatar,
                    email: user.email
                }
            }))
            .catch(err => {
                if (err.name === "ValidationError") {
                    return res.status(errorBadRequest).send({ message: err.message })
                }
                if (err.code === 11000) {
                    return res.status(errorDuplicate).send({ message: "Email address already exists" })
                }
                return res.status(errorInternalServer).send({ message: 'An error has occurred on the server' });
            }))

}

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(errorBadRequest).send({
            message: "The password and email fields are required"
        })
    }

    return User.findUserByCredentials(email, password)
        .then(user => {
            const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
            res.send({
                token
            })
        })
        .catch(err => {
            if (err.message === "Incorrect email or password" || err.message === "Username and Password does not match") {
                return res.status(errorUnauthorized).send({
                    message: err.message
                })
            }
            return res.status(errorInternalServer).send({
                message: err.message
            })
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

module.exports = { login, createUser, getUserById, getCurrentUser, updateCurrentUser };