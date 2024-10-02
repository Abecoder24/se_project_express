const router = require('express').Router();
const { getUsers, createUser, getUserById } = require("../controllers/users")
//get
router.get("/", getUsers);
//get Usr by ID
router.get("/:userId", getUserById);
//create User
router.post("/", createUser);

module.exports = router;