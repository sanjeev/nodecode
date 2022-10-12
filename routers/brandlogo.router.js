const express = require("express");
const mongoose = require("mongoose")
const { adminAuthMiddleware } = require("../middlewares/user.auth.middlewares");
const { getAllBrandLogos, getBrandLogoById, saveBrandLogo, updateBrandLogo, deleteBrandLogo } = require("../controllers/brandlogo.controller")
const { BrandLogo } = require('../models/brandlogo.model')

const brandlogoRouter = express.Router();

var multer = require('multer')
const path = require('path');

const { UPLOAD_BRANDLOGO_FOLDER } = process.env;
// var upload = multer({ dest: UPLOAD_BRANDLOGO_FOLDER })

// console.log(__dirname);
var toCreateDir = multer({ dest: path.join(__dirname, "../") + UPLOAD_BRANDLOGO_FOLDER })

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../") + UPLOAD_BRANDLOGO_FOLDER)
    },
    filename: function (req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error(`Please Upload a valid image file with ext png or jpg`))
        } else {
            BrandLogo.isExists(req.body.name).then(isExists => {
                if (isExists) {
                    return cb(new Error(`BrandLogo Name ${req.body.name} already exists !!`))
                } else {
                    var data = file.originalname.split('.');
                    // cb(null, file.fieldname + '-' + Date.now() + ".png")
                    //cb(null, data[0] + '-' + mongoose.Types.ObjectId() + ".png")
                    cb(null, data[0] + '-' + mongoose.Types.ObjectId() + path.extname(file.originalname))
                }
            });
        }
    }
});

var upload = multer({ storage: storage })

brandlogoRouter.get("/getAll", getAllBrandLogos);
brandlogoRouter.get("/getById/:id", adminAuthMiddleware, getBrandLogoById);
brandlogoRouter.post("/save", adminAuthMiddleware, upload.single('image'), saveBrandLogo);
brandlogoRouter.post("/update", adminAuthMiddleware, upload.single('image'), updateBrandLogo);
brandlogoRouter.post("/delete", adminAuthMiddleware, deleteBrandLogo);


module.exports = brandlogoRouter;
