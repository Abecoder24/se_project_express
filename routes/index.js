const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { errorNotFound } = require("../utils/statusCodes");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
    res.status(errorNotFound).send({ message: "Router not found" });
})

module.exports = router;