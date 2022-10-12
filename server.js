const express = require("express");
require('express-async-errors');

require('./logger/logger');
const morgan = require("morgan");
const handleErrors = require("./middlewares/error.handler.middlewares");
const helmet = require("helmet");
var cors = require('cors')

const application = express();
const {
    userRouter,
    sizeRouter,
    tagRouter,
    usertypeRouter,
    colorRouter,
    brandlogoRouter,
    categoryRouter,
    productRouter
} = require("./routers/routers");

application.use(helmet());

var corsOptions = {
    origin: 'https://abc.com',
    optionsSuccessStatus: 200
}
application.use(cors(corsOptions));

require('./database/db.connection')();
application.use(express.json());
application.use(morgan("dev"));

//Promise.reject(new Error("Error from Promise reject !!"))

application.get("/", (req, res) => {
    res.json({ message: "Success !!" });
});

const APIRouter = express.Router();
APIRouter.get("", (req, res) => {
    res.json({ message: "API is Working !!" });
});

application.use("/api", APIRouter);
APIRouter.use('/users', userRouter);
APIRouter.use('/SizeMaster', sizeRouter);
APIRouter.use('/TagMaster', tagRouter);
APIRouter.use('/UserTypeMaster', usertypeRouter);
APIRouter.use('/ColorMaster', colorRouter);
APIRouter.use('/BranLogoMaster', brandlogoRouter);
APIRouter.use('/CategoryMaster', categoryRouter);
APIRouter.use('/Products', productRouter);


const { UPLOAD_BRANDLOGO_FOLDER, UPLOAD_CATEGORY_FOLDER, UPLOAD_PRODUCT_FOLDER } = process.env;
APIRouter.get("/" + UPLOAD_BRANDLOGO_FOLDER + "/*", (req, res, next) => {
    const path = req.url;
    const filePath = `${__dirname}${path}`;
    res.sendFile(filePath, (err) => {
        next();
    });
});

APIRouter.get("/" + UPLOAD_CATEGORY_FOLDER + "/*", (req, res, next) => {
    const path = req.url;
    const filePath = `${__dirname}${path}`;
    res.sendFile(filePath, (err) => {
        next();
    });
});

APIRouter.get("/" + UPLOAD_PRODUCT_FOLDER + "/*", (req, res, next) => {
    const path = req.url;
    const filePath = `${__dirname}${path}`;
    res.sendFile(filePath, (err) => {
        next();
    });
});

application.use(handleErrors);
module.exports = { application };
