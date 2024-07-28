const { default: mongoose } = require("mongoose")

// get all users, product or orders
const httpGetAll = async (Model, res, next, type) => {
    try {
        const data = await Model.find()
        .sort({createdAt: -1} // sort by last created on top
        )

        res.status(200).json(data);
    }
    catch (error) {
        next(error)
    }
}

// get one user, product or order deatils
const httpGetOne = async (Model, res, next, id, type) => {
    if (!mongoose.isValidObjectId(id)) {
        return next(new Error(`invalid ${type} ID`))
    }
    try {
        const data = await Model.findById(id)

        if (!data) {
            res.status(404).json({ message: `${type} doesn't exist` }); // response to client
            return next(new Error(`${type} not found`));// forward to server's error handler
        }

        res.status(200).json(data)
    }
    catch (error) {
        next(error)
    }
}

// create new product or order
const httpPost = async (Model, req, res, next) => {
    try {
        const newData = await Model.create(req.body)
        res.status(201).json(newData)
    } catch (error) {
        next(error)
    }
}


// update user, product or order
const httpPut = async (Model, req, res, next, id, type) => {
    if (!mongoose.isValidObjectId(id)) {
        return next(new Error(`invalid ${type} ID`));
    }
    try {
        const updatedData = await Model.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          });

        if (!updatedData) {
            return next(new Error(`${type} not found`));
        }

        res.status(200).json(updatedData)
    }
    catch (error) {
        next(error)
    }
}

// delete a user, product or order
const httpDelete = async (Model, res, next, id, type) => {

    if (!mongoose.isValidObjectId(id)) {
        return next(new Error(`invalid ${type} ID`));
    }
    try {
        const deletedData = await Model.findByIdAndDelete(id);

        if (!deletedData) {
            return next(new Error(`${type} not found`));
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    httpGetAll,
    httpGetOne,
    httpPost,
    httpPut,
    httpDelete
}