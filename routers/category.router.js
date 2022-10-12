const express = require("express");
const mongoose = require("mongoose")
const { adminAuthMiddleware } = require("../middlewares/user.auth.middlewares");
const { getAllcategories, getCategoryById, saveCategory, updateCategory, deleteCategory } = require("../controllers/category.controller")
const { Category } = require('../models/category.model')

const categoryRouter = express.Router();

var multer = require('multer')
const path = require('path');

const { UPLOAD_CATEGORY_FOLDER } = process.env;
// var upload = multer({ dest: UPLOAD_CATEGORY_FOLDER })

// console.log(__dirname);
var toCreateDir = multer({ dest: path.join(__dirname, "../") + UPLOAD_CATEGORY_FOLDER })

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../") + UPLOAD_CATEGORY_FOLDER)
    },
    filename: function (req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error(`Please Upload a valid image file with ext png or jpg`))
        } else {
            Category.isExists(req.body.name).then(isExists => {
                if (isExists) {
                    return cb(new Error(`Category Name ${req.body.name} already exists !!`))
                } else {
                    var data = file.originalname.split('.');
                    cb(null, data[0] + '-' + mongoose.Types.ObjectId() + path.extname(file.originalname))
                }
            });
        }
    }
});

var upload = multer({ storage: storage })

categoryRouter.get("/getAll", getAllcategories);
categoryRouter.get("/getById/:id", adminAuthMiddleware, getCategoryById);
categoryRouter.post("/save", adminAuthMiddleware, upload.single('image'), saveCategory);
categoryRouter.post("/update", adminAuthMiddleware, upload.single('image'), updateCategory);
categoryRouter.post("/delete", adminAuthMiddleware, deleteCategory);


module.exports = categoryRouter;
