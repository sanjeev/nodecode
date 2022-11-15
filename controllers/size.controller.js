const { Size } = require('../models/size.model')
const Joi = require("joi")

function getStandardResponse(status, message, data) {
    return {
        status: status,
        message: message,
        data: data
    }
}

const getAllSizes = async (req, res, next) => {
    const limit = Number.parseInt(req.query.pagesize) || 5;
    const page = Number.parseInt(req.query.page) || 1;
    const sort_by = req.query.sort;
    const skip = limit * (page - 1);
    const sizes = await Size.find({ isActive: true }).sort({ name: sort_by }).skip(skip).limit(limit);
    let count = await Size.countDocuments({ isActive: true });
    if (sizes) {
        res.json({ sizes, count });
    } else {
        res.status(400);
        return next(new Error(`No Record Found !!`));
    }
}

const getSizeById = async (req, res, next) => {
    const _id = req.params.id;
    const size = await Size.findOne({ _id, isActive: true });
    if (size) {
        res.json({ size });
    } else {
        res.status(400);
        return next(new Error(`No Record Found !!`));
    }
}

const saveSize = async (req, res, next) => {
    const loggedInUser = req.session.user;

    const schema = Joi.object({
        name: Joi.string().min(1).max(20).required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        const name = result.value.name;
        const size = new Size({ name, createdBy: loggedInUser.id });

        const isExists = await Size.isExists(name);
        if (!isExists) {
            const result = await size.save();
            return res.json(getStandardResponse(true, "Add Successfully !!", result));
            //return res.json(result);
        } else {
            res.status(400);
            return next(new Error(`Size Name ${name} already exists !!`));
        }
    }
}

const updateSize = async (req, res, next) => {
    const loggedInUser = req.session.user;

    const schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().min(1).max(20).required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        const name = result.value.name;
        const sizeId = result.value.id;
        const isExists = await Size.isExists(name, sizeId);
        if (!isExists) {
            let size = await Size.findById(sizeId);
            size = Object.assign(size, result.value, { modifiedBy: loggedInUser.id });
            size = await size.save();
            res.json(size);
        } else {
            res.status(400);
            return next(new Error(`Size Name ${name} already exists !!`));
        }
    }
}

const deleteSize = async (req, res, next) => {
    const loggedInUser = req.session.user;
    const schema = Joi.object({
        id: Joi.string().required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        const sizeId = result.value.id;
        let size = await Size.findOne({ _id: sizeId, isActive: true });
        if (size) {
            size = Object.assign(size, { isActive: false, modifiedBy: loggedInUser.id });
            size = await size.save();
            res.json(size);
        } else {
            res.status(400);
            return next(new Error(`No Record Found !!`));
        }
    }
}

module.exports = { getAllSizes, getSizeById, saveSize, updateSize, deleteSize };