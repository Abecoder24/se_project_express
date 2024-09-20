const ClothingItem = require("../models/clothingItem");
const { Error_Bad_Request, Error_Not_Found, Error_Internal_Server, Status_Ok, Status_Created, Status_NoContent } = require("./statusCodes");


const createItem = (req, res) => {
    const { name, weather, imageURL } = req.body;
    console.log(name)
    ClothingItem.create({ name, weather, imageURL })
        .then(item => {
            res.status(Status_Created).send({ data: item });
        }).catch(err => {
            if (err.name === "ValidationError") {
                return res.status(Error_Bad_Request).send({ message: err.message })
            }
            return res.status(Error_Internal_Server).send({ message: err.message });
        })
}

const getItems = (req, res) => {
    ClothingItem.find({})
        .then(items => res.status(Status_Ok).send(items))
        .catch(err => {
            if (err.name === "ValidationError") {
                return res.status(Error_Bad_Request).send({ message: err.message })
            }
            return res.status(Error_Internal_Server).send({ message: err.message });
        })
}

const updateItem = (req, res) => {
    const { itemId } = req.params;
    const { imageURL } = req.body;

    ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
        .orFail()
        .then(item => res.status(Status_Ok).send({ data: item }))
        .catch(err => {
            if (err.name === "ValidationError") {
                return res.status(Error_Bad_Request).send({ message: err.message })
            }
            return res.status(Error_Internal_Server).send({ message: err.message });
        })
}

const deleteItem = (req, res) => {
    const { itemId } = req.params;

    ClothingItem.findByIdAndDelete(itemId)
        .orFail()
        .then(item => res.status(Status_NoContent).send({ message: "Deleted" }))
        .catch(err => {
            if (err.name === "ValidationError") {
                return res.status(Error_Bad_Request).send({ message: err.message })
            }
            return res.status(Error_Internal_Server).send({ message: err.message });
        })
}
module.exports = {
    createItem,
    getItems,
    updateItem,
    deleteItem
}