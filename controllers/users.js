const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const { statusCreated, errorBadRequest, errorNotFound, errorInternalServer, errorDuplicate, errorUnauthorized } = require("../utils/statusCodes");
require('dotenv').config()
const { JWT_SECRET = "super-strong-secret" } = process.env
const {handleErrors} = require('../errors/error');


const getCurrentUser = (req, res, next) => {
    User.findOne({ _id: req.user._id }).orFail()
        .then(user => res.send(user))
        .catch(err => {
            if (err.name === "DocumentNotFoundError") {
                next(new handleErrors("User not Found", errorNotFound))
            }
            if (err.name === "CastError") {
                next(new handleErrors("Invalid user Id", errorBadRequest));
            }
            next(new handleErrors("Unable to handle the request", errorInternalServer));
        })
}

const updateCurrentUser = (req, res, next) => {
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
                next(new handleErrors(err.message, errorBadRequest));
            }
            if (err.name === "DocumentNotFoundError") {
                next(new handleErrors("User not Found", errorNotFound));
            }
            next('An error has occurred on the server', errorInternalServer);
        })
}

const createUser = (req, res, next) => {
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
                    next(new handleErrors(err.message, errorBadRequest));
                }
                if (err.code === 11000) {
                    next(new handleErrors("Email address already exists", errorDuplicate));
                }
                next(new handleErrors('An error has occurred on the server', errorInternalServer));
            }))

}

const login = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new handleErrors("The password and email fields are required", errorBadRequest);
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
                next(err.message, errorUnauthorized);
            }
            next(err)
        })
}

const getUserById = (req, res, next) => {
    const { userId } = req.params;
    User.findById(userId)
        .orFail()
        .then(user => res.send(user))
        .catch(err => {
            if (err.name === "DocumentNotFoundError") {
                next(new handleErrors("User not Found", errorNotFound));
            }
            if (err.name === "CastError") {
                next(new handleErrors("Invalid User ID", errorBadRequest));
            }
            next(new handleErrors("Invalid data", errorInternalServer));
        })
}

module.exports = { login, createUser, getUserById, getCurrentUser, updateCurrentUser };