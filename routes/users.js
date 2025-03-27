const router = require('express').Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const auth = require('../middleware/auth');
const {celebrate, Joi} = require('celebrate');

// get current logged in user
router.get('/me', auth, getCurrentUser);
// update user name and avatar
router.patch('/me', auth, celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30),
        avatar: Joi.string().required().uri()
    })
}),updateCurrentUser);
module.exports = router;