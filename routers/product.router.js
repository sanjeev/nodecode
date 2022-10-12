const express = require("express");
const mongoose = require("mongoose")
const { adminAuthMiddleware } = require("../middlewares/user.auth.middlewares");
const { getAllProducts, getProductById, saveProduct, updateProduct, deleteProduct,getProductByCategory } = require("../controllers/product.controller")
const { Product } = require('../models/product.model')

const productRouter = express.Router();

var multer = require('multer')
const path = require('path');

const { UPLOAD_PRODUCT_FOLDER } = process.env;
// var upload = multer({ dest: UPLOAD_PRODUCT_FOLDER })

// console.log(__dirname);
var toCreateDir = multer({ dest: path.join(__dirname, "../") + UPLOAD_PRODUCT_FOLDER })

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../") + UPLOAD_PRODUCT_FOLDER)
    },
    filename: function (req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            return cb(new Error(`Please Upload a valid image file with ext png or jpg`))
        } else {
            Product.isExists(req.body.name).then(isExists => {
                if (isExists) {
                    return cb(new Error(`Product Name ${req.body.name} already exists !!`))
                } else {
                    var data = file.originalname.split('.');
                    cb(null, data[0] + '-' + mongoose.Types.ObjectId() + path.extname(file.originalname))
                }
            });
        }
    }
});

var upload = multer({ storage: storage })

productRouter.get("/getAll", getAllProducts);
productRouter.get("/getById/:id", adminAuthMiddleware, getProductById);
productRouter.post("/save", adminAuthMiddleware, upload.array('images',5), saveProduct);
productRouter.post("/update", adminAuthMiddleware, upload.array('images',5), updateProduct);
productRouter.post("/delete", adminAuthMiddleware, deleteProduct);
productRouter.post("/productByCategory/:categoryId", adminAuthMiddleware, getProductByCategory);




module.exports = productRouter;
