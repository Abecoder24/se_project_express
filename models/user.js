const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    avatar: {
        type: String,
        required: [true, "The avatar feild is Required"],
        validate: {
            validator(value) {
                return validator.isURL(value)
            },
            message: "You must enter a valid URL"
        }
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator(value) {
                return validator.isURL(value)
            },
            message: "Email Address is not valid"
        },
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false

    }
})

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
    return this.findOne({ email })
        .select("+password")
        .then((user) => {
            if (!user) {
                return Promise.reject(new Error('Incorrect email or password'));
            }

            return bcrypt.compare(password, user.password).then((matched) => {
                if (!matched) Promise.reject(new Error('Username and Password does not match'));
                return user;
            });
        })

};

module.exports = mongoose.model("user", userSchema);