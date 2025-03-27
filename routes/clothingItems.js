const router = require("express").Router();
const { createItem, getItems, deleteItem, likeClothingItem, dislikeClothingItem } = require("../controllers/clothingItem");
const auth = require("../middleware/auth");
const {celebrate, Joi} = require('celebrate');

// read
router.get("/", getItems);

// create
router.post("/", auth, celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        weather: Joi.string().required(),
        imageUrl: Joi.string().required().uri()
    })
}), createItem);

// delete
router.delete("/:itemId", auth, celebrate({
    params: Joi.object().keys({
        itemId: Joi.string().alphanum().length(24),
    }).unknown(true),
}), deleteItem);

// Ad Like
router.put("/:itemId/likes", auth, celebrate({
    params: Joi.object().keys({
        itemId: Joi.string().alphanum().length(24),
    }).unknown(true),
}), likeClothingItem);

// Dislike
router.delete("/:itemId/likes", auth, celebrate({
    params: Joi.object().keys({
        itemId: Joi.string().alphanum().length(24),
    }).unknown(true),
}), dislikeClothingItem);


module.exports = router;