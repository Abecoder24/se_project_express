const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    imageUrl: {
        type: String,
        required: [true, "Image feild is Required"],
        validate: {
            validator(value) {
                return validator.isURL(value)
            },
            message: "You must enter a valid URL"
        }
    },
    weather: {
        type: String,
        required: [true, "Weather feild is Required"],
        enm: ["hot", "warm", "cold"]
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Owner feild is required"]
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("clothingItem", clothingItemSchema);