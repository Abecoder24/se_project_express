const ClothingItem = require("../models/clothingItem");
const { statusCreated, errorBadRequest, errorNotFound, errorInternalServer, errorForbidden } = require("../utils/statusCodes");
const handleErrors = require('../errors/error')

const createItem = (req, res, next) => {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;
    ClothingItem.create({ name, weather, imageUrl, owner })
        .then(item => {
            res.status(statusCreated).send({ data: item });
        }).catch(err => {
            if (err.name === "ValidationError") {
                next(new handleErrors(err.message, errorBadRequest));
            }
            next(err)
        })
}

const getItems = (req, res, next) => {
    ClothingItem.find({})
        .then(items => res.send(items))
        .catch(() => {
            next(new handleErrors('Invalid Data', errorInternalServer))
        })
}

const deleteItem = (req, res, next) => {
    const { itemId } = req.params;
    const currentUserId = req.user._id;

    ClothingItem.findOne({
        _id: itemId
    }).then(item => {
        if (!item) {
            throw new handleErrors('Unable to find the Item', errorNotFound);
        }
        if ((item.owner).toString() !== currentUserId) {
            throw new handleErrors("You don't have permissons to delete this item", errorForbidden);
        }

        return ClothingItem.deleteOne({
            _id: itemId
        })
            .then(() => res.send(item))
            .catch((err) => next(err))
    }).catch(err => {
        if (err.name === "DocumentNotFoundError") {
            next(new handleErrors("Document not Found", errorNotFound));
        }
        if (err.name === "CastError") {
            next(new handleErrors("Invalid Item ID", errorBadRequest))
        }
        next(err);
    })
}

const likeClothingItem = (req, res, next) => {
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
                next(new handleErrors("Document not found", errorNotFound));
            }
            if (err.name === "CastError") {
                next(new handleErrors("Invalid Item Id", errorBadRequest));
            }
            next(new handleErrors('Invalid Data', errorInternalServer));
        })
}

const dislikeClothingItem = (req, res, next) => {
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
                next(new handleErrors('Document not found', 404));
            }
            if (err.name === "CastError") {
                next(new handleErrors("Invalid Item Id", errorBadRequest));
            }
            next(new handleErrors("Invalid Data", errorInternalServer));
        })
}
module.exports = {
    createItem,
    getItems,
    deleteItem,
    likeClothingItem,
    dislikeClothingItem
}