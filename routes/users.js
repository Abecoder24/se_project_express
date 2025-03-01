const router = require('express').Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const auth = require('../middleware/auth');

// get current logged in user
router.get('/me', auth, getCurrentUser);
// update user name and avatar
router.patch('/me', auth, updateCurrentUser);
module.exports = router;