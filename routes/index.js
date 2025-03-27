const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { errorNotFound } = require("../utils/statusCodes");
const { login, createUser } = require("../controllers/users");
const { celebrate, Joi } = require('celebrate');
const handleErrors = require('../errors/error');

router.use("/users", userRouter);
router.use("/items", itemRouter);

//testing server crash
router.get('/crash-test', () => {
    setTimeout(() => {
        throw new Error('Server will crash now');
    }, 0);
});


// login
router.post("/signin", celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8)
    })
}), login);
// signup
router.post("/signup", celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().min(8),
        name: Joi.string().required().min(2).max(30),
        avatar: Joi.string().required().uri()
    })
}), createUser);

router.use((req, res, next) => {
    next(new handleErrors("Router not found", errorNotFound))
})

module.exports = router;