const { Color } = require('../models/color.model')
const Joi = require("joi")

const getAllColors = async (req, res, next) => {
    const limit = Number.parseInt(req.query.pagecolor) || 5;
    const page = Number.parseInt(req.query.page) || 1;
    const sort_by = req.query.sort;
    const skip = limit * (page - 1);
    const colors = await Color.find({ isActive: true }).sort({ name: sort_by }).skip(skip).limit(limit);
    let count = await Color.countDocuments({ isActive: true });
    if (colors) {
        res.json({ colors, count });
    } else {
        res.status(400);
        return next(new Error(`No Record Found !!`));
    }
}

const getColorById = async (req, res, next) => {
    const _id = req.params.id;
    const color = await Color.findOne({ _id, isActive: true });
    if (color) {
        res.json({ color });
    } else {
        res.status(400);
        return next(new Error(`No Record Found !!`));
    }
}

const saveColor = async (req, res, next) => {
    const loggedInUser = req.session.user;

    const schema = Joi.object({
        name: Joi.string().min(1).max(20).required(),
        code: Joi.string().min(3).max(20).required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        const name = result.value.name;
        const code = result.value.code;
        //const color = new Color({ name,code, createdBy: loggedInUser.id });
        const color = new Color({ ...result.value, createdBy: loggedInUser.id });

        const isExists = await Color.isExists(name,code);
        if (!isExists) {
            const result = await color.save();
            return res.json(result);
        } else {
            res.status(400);
            return next(new Error(`Color Name ${name} or Color Code ${code} already exists !!`));
        }
    }
}

const updateColor = async (req, res, next) => {
    const loggedInUser = req.session.user;

    const schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().min(1).max(20).required(),
        code: Joi.string().min(3).max(20).required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        const name = result.value.name;
        const code = result.value.code;
        const colorId = result.value.id;
        const isExists = await Color.isExists(name,code, colorId);
        if (!isExists) {
            let color = await Color.findById(colorId);
            color = Object.assign(color, result.value, { modifiedBy: loggedInUser.id });
            color = await color.save();
            res.json(color);
        } else {
            res.status(400);
            return next(new Error(`Color Name ${name} or Color Code ${code} already exists !!`));
        }
    }
}

const deleteColor = async (req, res, next) => {
    const loggedInUser = req.session.user;
    const schema = Joi.object({
        id: Joi.string().required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        const colorId = result.value.id;
        let color = await Color.findOne({ _id: colorId, isActive: true });
        if (color) {
            color = Object.assign(color, { isActive: false, modifiedBy: loggedInUser.id });
            color = await color.save();
            res.json(color);
        } else {
            res.status(400);
            return next(new Error(`No Record Found !!`));
        }
    }
}

module.exports = { getAllColors, getColorById, saveColor, updateColor, deleteColor };