const router = require("express").Router();

const { createItem, getItems, deleteItem, likeClothingItem, dislikeClothingItem } = require("../controllers/clothingItem");
const auth = require("../middleware/auth");

// read
router.get("/", getItems);
// create
router.post("/", auth, createItem);
// delete
router.delete("/:itemId", auth, deleteItem);
// Ad Like
router.put("/:itemId/likes", auth, likeClothingItem);
// Dislike
router.delete("/:itemId/likes", auth, dislikeClothingItem);


module.exports = router;