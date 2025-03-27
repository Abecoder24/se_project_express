const router = require("express").Router();
const { celebrate, Joi } = require('celebrate');
const auth = require("../middleware/auth");
const { createItem, getItems, deleteItem, likeClothingItem, dislikeClothingItem } = require("../controllers/clothingItem");

// read
router.get("/", getItems);

// create
router.post("/", auth, celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        weather: Joi.string().required().valid('hot', 'warm', 'cold'),
        imageUrl: Joi.string().required().uri()
    })
}), createItem);

// delete
router.delete("/:itemId", auth, celebrate({
    params: Joi.object().keys({
        itemId: Joi.string().alphanum().length(24),
    }),
}), deleteItem);

// Ad Like
router.put("/:itemId/likes", auth, celebrate({
    params: Joi.object().keys({
        itemId: Joi.string().alphanum().length(24),
    }),
}), likeClothingItem);

// Dislike
router.delete("/:itemId/likes", auth, celebrate({
    params: Joi.object().keys({
        itemId: Joi.string().alphanum().length(24),
    }),
}), dislikeClothingItem);


module.exports = router;