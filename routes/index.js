const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { errorNotFound } = require("../utils/statusCodes");
const { login, createUser } = require("../controllers/users")

router.use("/users", userRouter);
router.use("/items", itemRouter);

// login
router.post("/signin", login);
// signup
router.post("/signup", createUser);

router.use((req, res) => {
    res.status(errorNotFound).send({ message: "Router not found" });
})

module.exports = router;