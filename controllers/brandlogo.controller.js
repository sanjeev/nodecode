const { BrandLogo } = require('../models/brandlogo.model')
const Joi = require("joi")
const _ = require("underscore")

const { UPLOAD_BRANDLOGO_FOLDER } = process.env;

const getAllBrandLogos = async (req, res, next) => {
    const limit = Number.parseInt(req.query.pagebrandlogo) || 5;
    const page = Number.parseInt(req.query.page) || 1;
    const sort_by = req.query.sort;
    const skip = limit * (page - 1);
    const brandlogos = await BrandLogo.find({ isActive: true }).sort({ name: sort_by }).skip(skip).limit(limit);
    let count = await BrandLogo.countDocuments({ isActive: true });
    if (brandlogos) {
        res.json({ brandlogos, count });
    } else {
        res.status(400);
        return next(new Error(`No Record Found !!`));
    }
}

const getBrandLogoById = async (req, res, next) => {
    const _id = req.params.id;
    const brandlogo = await BrandLogo.findOne({ _id, isActive: true });
    if (brandlogo) {
        res.json({ brandlogo });
    } else {
        res.status(400);
        return next(new Error(`No Record Found !!`));
    }
}

const saveBrandLogo = async (req, res, next) => {
    if (!req.file || _.isEmpty(req.file)) {
        res.status(400);
        return next(new Error(`No file uploaded`));
    }

    const loggedInUser = req.session.user;

    //console.log(req.file);
    //res.json({ msg: "uploaded !!" });

    const imagePath = UPLOAD_BRANDLOGO_FOLDER + "/" + req.file.filename;
    const schema = Joi.object({
        name: Joi.string().min(1).max(20).required(),
        imagePath: Joi.string().min(10).max(200).required()
    });

    const result = schema.validate({ ...req.body, imagePath });

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        const name = result.value.name;
        const brandlogo = new BrandLogo({ ...result.value, createdBy: loggedInUser.id });

        const isExists = await BrandLogo.isExists(name);
        if (!isExists) {
            const result = await brandlogo.save();
            return res.json(result);
        } else {
            res.status(400);
            return next(new Error(`BrandLogo Name ${name} already exists !!`));
        }
    }
}

const updateBrandLogo = async (req, res, next) => {
    const loggedInUser = req.session.user;
    const imagePath = UPLOAD_BRANDLOGO_FOLDER + "/" + req.file.filename;

    const schema = Joi.object({
        id: Joi.string().required(),
        name: Joi.string().min(1).max(20).required(),
        imagePath: Joi.string().min(10).max(200).required()
    });

    const result = schema.validate({ ...req.body, imagePath });

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        const name = result.value.name;
        const brandlogoId = result.value.id;
        const isExists = await BrandLogo.isExists(name, brandlogoId);
        if (!isExists) {
            let brandlogo = await BrandLogo.findById(brandlogoId);
            brandlogo = Object.assign(brandlogo, result.value, { modifiedBy: loggedInUser.id });
            brandlogo = await brandlogo.save();
            res.json(brandlogo);
        } else {
            res.status(400);
            return next(new Error(`BrandLogo Name ${name} already exists !!`));
        }
    }
}

const deleteBrandLogo = async (req, res, next) => {
    const loggedInUser = req.session.user;
    const schema = Joi.object({
        id: Joi.string().required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        const brandlogoId = result.value.id;
        let brandlogo = await BrandLogo.findOne({ _id: brandlogoId, isActive: true });
        if (brandlogo) {
            brandlogo = Object.assign(brandlogo, { isActive: false, modifiedBy: loggedInUser.id });
            brandlogo = await brandlogo.save();
            res.json(brandlogo);
        } else {
            res.status(400);
            return next(new Error(`No Record Found !!`));
        }
    }
}

module.exports = { getAllBrandLogos, getBrandLogoById, saveBrandLogo, updateBrandLogo, deleteBrandLogo };