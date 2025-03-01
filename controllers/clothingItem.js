const ClothingItem = require("../models/clothingItem");
const { statusCreated, errorBadRequest, errorNotFound, errorInternalServer, errorForbidden } = require("../utils/statusCodes");


const createItem = (req, res) => {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;
    ClothingItem.create({ name, weather, imageUrl, owner })
        .then(item => {
            res.status(statusCreated).send({ data: item });
        }).catch(err => {
            if (err.name === "ValidationError") {
                return res.status(errorBadRequest).send({ message: err.message })
            }
            return res.status(errorInternalServer).send({ message: 'Invalid data' });
        })
}

const getItems = (req, res) => {
    ClothingItem.find({})
        .then(items => res.send(items))
        .catch(() => {
            res.status(errorInternalServer).send({ message: 'Invalid data' })
        })
}

const deleteItem = (req, res) => {
    const { itemId } = req.params;
    console.log(req.user)
    const currentUserId = req.user._id;

    ClothingItem.findOne({
        _id: itemId
    }).then(item => {
        if (!item) {
            return res.status(errorNotFound).send({
                message: "Unable to find the Item"
            });
        }
        if ((item.owner).toString() !== currentUserId) {
            return res.status(errorForbidden).send({
                message: "You don't have permissons to delete this item"
            });
        }

        return ClothingItem.deleteOne({
            _id: itemId
        })
            .then(() => res.send(item))
            .catch(() => res.status(errorInternalServer).send("ubable to delete the Item"))
    }).catch(err => {
        if (err.name === "DocumentNotFoundError") {
            return res.status(errorNotFound).send({ message: "Document not Found" });
        }
        if (err.name === "CastError") {
            return res.status(errorBadRequest).send({ message: "Invalid Item ID" })
        }
        return res.status(errorInternalServer).send({ message: 'Invalid data' });
    })
}

const likeClothingItem = (req, res) => {
    const { itemId } = req.params;
    const { _id } = req.user;

    ClothingItem.findByIdAndUpdate(itemId, {
        $addToSet: {
            likes: _id
        }
    },
        {
            new: true
        })
        .orFail()
        .then((item) => res.send({
            data: item
        }))
        .catch((err) => {
            if (err.name === "DocumentNotFoundError") {
                return res.status(errorNotFound).send({ message: "Document not Found" });
            }
            if (err.name === "CastError") {
                return res.status(errorBadRequest).send({ message: "Invalid Item ID" })
            }
            return res.status(errorInternalServer).send({ message: 'Invalid data' });
        })
}

const dislikeClothingItem = (req, res) => {
    const { itemId } = req.params;
    const { _id } = req.user;

    ClothingItem.findByIdAndUpdate(itemId, {
        $pull: {
            likes: _id
        }
    },
        {
            new: true
        })
        .orFail()
        .then((item) => res.send({
            data: item
        }))
        .catch((err) => {
            if (err.name === "DocumentNotFoundError") {
                return res.status(errorNotFound).send({ message: "Document not Found" });
            }
            if (err.name === "CastError") {
                return res.status(errorBadRequest).send({ message: "Invalid Item ID" })
            }
            return res.status(errorInternalServer).send({ message: 'Invalid data' });
        })
}
module.exports = {
    createItem,
    getItems,
    deleteItem,
    likeClothingItem,
    dislikeClothingItem
}