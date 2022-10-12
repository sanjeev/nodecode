const { Product } = require('../models/product.model')
const Joi = require("joi")
const _ = require("underscore")

const { UPLOAD_PRODUCT_FOLDER } = process.env;

const getAllProducts = async (req, res, next) => {
    const limit = Number.parseInt(req.query.pagesize) || 5;
    const page = Number.parseInt(req.query.page) || 1;
    const sort_by = req.query.sort;
    const skip = limit * (page - 1);
    const Products = await Product.find({ isActive: true }).sort({ name: sort_by }).skip(skip).limit(limit);
    let count = await Product.countDocuments({ isActive: true });
    if (Products) {
        res.json({ Products, count });
    } else {
        res.status(400);
        return next(new Error(`No Record Found !!`));
    }
}

const getProductById = async (req, res, next) => {
    const _id = req.params.id;
    const product = await Product.findOne({ _id, isActive: true });
    if (product) {
        res.json({ product });
    } else {
        res.status(400);
        return next(new Error(`No Record Found !!`));
    }
}

const saveProduct = async (req, res, next) => {
    if (!req.files || _.isEmpty(req.files)) {
        res.status(400);
        return next(new Error(`No file uploaded`));
    }
    console.log(req.files.length)
    if (req.files.length < 5) {
        res.status(400);
        return next(new Error(`Please upload 5 images per product`));
    }
    const loggedInUser = req.session.user;

    let imagePath = [];
    for (const file of req.files) {
        imagePath.push(UPLOAD_PRODUCT_FOLDER + "/" + file.filename);
    }

    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required(),
        title: Joi.string().min(3).max(20).required(),
        code: Joi.string().min(1).max(20).required(),
        price: Joi.number().min(1).required(),
        salePrice: Joi.number().min(1).required(),
        discount: Joi.number(),
        size: Joi.string().required(),
        tag: Joi.string().required(),
        color: Joi.string().required(),
        category: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        isSale: Joi.boolean(),
        isNewProduct: Joi.boolean(),
        shortDetails: Joi.string(),
        description: Joi.string().min(3).max(20).required(),
        images: Joi.array().required()
    });

    const result = schema.validate({ ...req.body, images: imagePath });

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        const name = result.value.name;
        const product = new Product({ ...result.value, createdBy: loggedInUser.id });

        const isExists = await Product.isExists(name);
        if (!isExists) {
            const result = await product.save();
            return res.json(result);
        } else {
            res.status(400);
            return next(new Error(`Product Name ${name} already exists !!`));
        }
    }
}

const updateProduct = async (req, res, next) => {
    if (!req.files || _.isEmpty(req.files)) {
        res.status(400);
        return next(new Error(`No file uploaded`));
    }

    if (req.files.length < 5) {
        res.status(400);
        return next(new Error(`Please upload 5 images per product`));
    }
    const loggedInUser = req.session.user;

    let imagePath = [];
    for (const file of req.files) {
        imagePath.push(UPLOAD_PRODUCT_FOLDER + "/" + file.filename);
    }

    const schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().min(3).max(20).required(),
        title: Joi.string().min(3).max(20).required(),
        code: Joi.string().min(1).max(20).required(),
        price: Joi.number().min(1).required(),
        salePrice: Joi.number().min(1).required(),
        discount: Joi.number(),
        size: Joi.string().required(),
        tag: Joi.string().required(),
        color: Joi.string().required(),
        category: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        isSale: Joi.boolean(),
        isNewProduct: Joi.boolean(),
        shortDetails: Joi.string(),
        description: Joi.string().min(3).max(20).required(),
        images: Joi.array().required()
    });

    const result = schema.validate({ ...req.body, images: imagePath });

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        const name = result.value.name;
        const productId = result.value.id;
        const isExists = await Product.isExists(name, productId);
        if (!isExists) {
            let product = await Product.findById(productId);
            product = Object.assign(product, result.value, { modifiedBy: loggedInUser.id });
            product = await product.save();
            res.json(product);
        } else {
            res.status(400);
            return next(new Error(`Product Name ${name} already exists !!`));
        }
    }
}

const deleteProduct = async (req, res, next) => {
    const loggedInUser = req.session.user;
    const schema = Joi.object({
        id: Joi.string().required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        const productId = result.value.id;
        let product = await Product.findOne({ _id: productId, isActive: true });
        if (product) {
            product = Object.assign(product, { isActive: false, modifiedBy: loggedInUser.id });
            product = await product.save();
            res.json(product);
        } else {
            res.status(400);
            return next(new Error(`No Record Found !!`));
        }
    }
}

const getProductByCategory = async (req, res, next) => {
    const products = await Product.find({ category: req.params.categoryId, isActive: true });
    res.json({ products })
};

module.exports = { getAllProducts, getProductById, saveProduct, updateProduct, deleteProduct, getProductByCategory };