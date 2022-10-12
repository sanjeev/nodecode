const { Tag } = require('../models/tag.model')
const Joi = require("joi")

const getAllTags = async (req, res, next) => {
    const limit = Number.parseInt(req.query.pagetag) || 5;
    const page = Number.parseInt(req.query.page) || 1;
    const sort_by = req.query.sort;
    const skip = limit * (page - 1);
    const tags = await Tag.find({ isActive: true }).sort({ name: sort_by }).skip(skip).limit(limit);
    let count = await Tag.countDocuments({ isActive: true });
    if (tags) {
        res.json({ tags, count });
    } else {
        res.status(400);
        return next(new Error(`No Record Found !!`));
    }
}

const getTagById = async (req, res, next) => {
    const _id = req.params.id;
    const tag = await Tag.findOne({ _id, isActive: true });
    if (tag) {
        res.json({ tag });
    } else {
        res.status(400);
        return next(new Error(`No Record Found !!`));
    }
}

const saveTag = async (req, res, next) => {
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
        const tag = new Tag({ name, createdBy: loggedInUser.id });

        const isExists = await Tag.isExists(name);
        if (!isExists) {
            const result = await tag.save();
            return res.json(result);
        } else {
            res.status(400);
            return next(new Error(`Tag Name ${name} already exists !!`));
        }
    }
}

const updateTag = async (req, res, next) => {
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
        const tagId = result.value.id;
        const isExists = await Tag.isExists(name, tagId);
        if (!isExists) {
            let tag = await Tag.findById(tagId);
            tag = Object.assign(tag, result.value, { modifiedBy: loggedInUser.id });
            tag = await tag.save();
            res.json(tag);
        } else {
            res.status(400);
            return next(new Error(`Tag Name ${name} already exists !!`));
        }
    }
}

const deleteTag = async (req, res, next) => {
    const loggedInUser = req.session.user;
    const schema = Joi.object({
        id: Joi.string().required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        const tagId = result.value.id;
        let tag = await Tag.findOne({ _id: tagId, isActive: true });
        if (tag) {
            tag = Object.assign(tag, { isActive: false, modifiedBy: loggedInUser.id });
            tag = await tag.save();
            res.json(tag);
        } else {
            res.status(400);
            return next(new Error(`No Record Found !!`));
        }
    }
}

module.exports = { getAllTags, getTagById, saveTag, updateTag, deleteTag };