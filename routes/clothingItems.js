const router = require("express").Router();

const { createItem, getItems, updateItem, deleteItem, likeClothingItem, dislikeClothingItem } = require("../controllers/clothingItem");

//create
router.post("/", createItem);
//read
router.get("/", getItems);
//update
router.put("/:itemId", updateItem);
//delete
router.delete("/:itemId", deleteItem);
//Ad Like
router.put("/:itemId/likes", likeClothingItem);
//Dislike
router.delete("/:itemId/likes", dislikeClothingItem);


module.exports = router;