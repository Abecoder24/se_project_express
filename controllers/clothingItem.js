const ClothingItem = require("../models/clothingItem");
const { Error_Bad_Request, Error_Not_Found, Error_Internal_Server, Status_Created, Status_NoContent } = require("../utils/statusCodes");


const createItem = (req, res) => {
    let { name, weather, imageUrl } = req.body;
    let owner = req.user._id;
    ClothingItem.create({ name, weather, imageUrl, owner })
        .then(item => {
            res.status(Status_Created).send({ data: item });
        }).catch(err => {
            if (err.name === "ValidationError") {
                return res.status(Error_Bad_Request).send({ message: err.message })
            }
            return res.status(Error_Internal_Server).send({ message: 'Invalid data' });
        })
}

const getItems = (req, res) => {
    ClothingItem.find({})
        .then(items => res.send(items))
        .catch(err => {
            if (err.name === "ValidationError") {
                return res.status(Error_Bad_Request).send({ message: err.message })
            }
            return res.status(Error_Internal_Server).send({ message: 'Invalid data' });
        })
}

const deleteItem = (req, res) => {
    let { itemId } = req.params;

    ClothingItem.findByIdAndDelete(itemId)
        .orFail()
        .then(item => res.status(Status_NoContent).send({ message: "Deleted" }))
        .catch(err => {
            if (err.name === "ValidationError") {
                return res.status(Error_Bad_Request).send({ message: err.message })
            }
            return res.status(Error_Internal_Server).send({ message: 'Invalid data' });
        })
}

const likeClothingItem = (req, res) => {
    let { itemId } = req.params;
    let { _id } = req.user;

    ClothingItem.findByIdAndUpdate(itemId, {
        $addToSet: {
            likes: _id
        }
    })
        .orFail()
        .then((item) => res.send({
            data: item
        }))
        .catch((err) => {
            if (err.name === "ValidationError") {
                return res.status(Error_Bad_Request).send({ message: err.message })
            }
            return res.status(Error_Internal_Server).send({ message: 'Invalid data' });
        })
}

const dislikeClothingItem = (req, res) => {
    let { itemId } = req.params;
    let { _id } = req.user;

    ClothingItem.findByIdAndUpdate(itemId, {
        $pull: {
            likes: _id
        }
    })
        .orFail()
        .then((item) => res.send({
            data: item
        }))
        .catch((err) => {
            if (err.name === "ValidationError") {
                return res.status(Error_Bad_Request).send({ message: err.message })
            }
            return res.status(Error_Internal_Server).send({ message: 'Invalid data' });
        })
}
module.exports = {
    createItem,
    getItems,
    updateItem,
    deleteItem,
    likeClothingItem,
    dislikeClothingItem
}