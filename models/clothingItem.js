const mongoose = require("mongoose");

const clothingItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    imageURL: {
        type: String,
        required: [true, "Image feild is Required"],
        vlidate: {
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
    }
})

module.exports = mongoose.model("clothingItem", clothingItemSchema);