const router = require('express').Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const auth = require('../middleware/auth');
// // get Usr by ID
// router.get("/:userId", getUserById);
// get current logged in user
router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, updateCurrentUser);
module.exports = router;