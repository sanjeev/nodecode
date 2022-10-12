const { Category } = require('../models/category.model')
const Joi = require("joi")
const _ = require("underscore")

const { UPLOAD_CATEGORY_FOLDER } = process.env;

const getAllcategories = async (req, res, next) => {
    const limit = Number.parseInt(req.query.pagesize) || 5;
    const page = Number.parseInt(req.query.page) || 1;
    const sort_by = req.query.sort;
    const skip = limit * (page - 1);
    const categories = await Category.find({ isActive: true }).sort({ name: sort_by }).skip(skip).limit(limit);
    let count = await Category.countDocuments({ isActive: true });
    if (categories) {
        res.json({ categories, count });
    } else {
        res.status(400);
        return next(new Error(`No Record Found !!`));
    }
}

const getCategoryById = async (req, res, next) => {
    const _id = req.params.id;
    const category = await Category.findOne({ _id, isActive: true });
    if (category) {
        res.json({ category });
    } else {
        res.status(400);
        return next(new Error(`No Record Found !!`));
    }
}

const saveCategory = async (req, res, next) => {
    if (!req.file || _.isEmpty(req.file)) {
        res.status(400);
        return next(new Error(`No file uploaded`));
    }

    const loggedInUser = req.session.user;

    const imagePath = UPLOAD_CATEGORY_FOLDER + "/" + req.file.filename;
    const schema = Joi.object({
        name: Joi.string().min(1).max(20).required(),
        title: Joi.string().min(1).max(20).required(),
        isSave: Joi.number().min(1).max(99).required(),
        link: Joi.string().min(20).max(200).required(),
        imagePath: Joi.string().min(10).max(200).required()
    });

    const result = schema.validate({ ...req.body, imagePath });

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        const name = result.value.name;
        const category = new Category({ ...result.value, createdBy: loggedInUser.id });

        const isExists = await Category.isExists(name);
        if (!isExists) {
            const result = await category.save();
            return res.json(result);
        } else {
            res.status(400);
            return next(new Error(`Category Name ${name} already exists !!`));
        }
    }
}

const updateCategory = async (req, res, next) => {
    const loggedInUser = req.session.user;
    const imagePath = UPLOAD_CATEGORY_FOLDER + "/" + req.file.filename;

    const schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().min(1).max(20).required(),
        title: Joi.string().min(1).max(20).required(),
        isSave: Joi.number().min(1).max(99).required(),
        link: Joi.string().min(20).max(200).required(),
        imagePath: Joi.string().min(10).max(200).required()
    });

    const result = schema.validate({ ...req.body, imagePath });

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        const name = result.value.name;
        const categoryId = result.value.id;
        const isExists = await Category.isExists(name, categoryId);
        if (!isExists) {
            let category = await Category.findById(categoryId);
            category = Object.assign(category, result.value, { modifiedBy: loggedInUser.id });
            category = await category.save();
            res.json(category);
        } else {
            res.status(400);
            return next(new Error(`Category Name ${name} already exists !!`));
        }
    }
}

const deleteCategory = async (req, res, next) => {
    const loggedInUser = req.session.user;
    const schema = Joi.object({
        id: Joi.string().required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        const categoryId = result.value.id;
        let category = await Category.findOne({ _id: categoryId, isActive: true });
        if (category) {
            category = Object.assign(category, { isActive: false, modifiedBy: loggedInUser.id });
            category = await category.save();
            res.json(category);
        } else {
            res.status(400);
            return next(new Error(`No Record Found !!`));
        }
    }
}

module.exports = { getAllcategories, getCategoryById, saveCategory, updateCategory, deleteCategory };