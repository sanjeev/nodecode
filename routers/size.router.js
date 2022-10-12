const express = require("express");
const { adminAuthMiddleware } = require("../middlewares/user.auth.middlewares");
const { getAllSizes, getSizeById, saveSize, updateSize, deleteSize } = require("../controllers/size.controller")

const sizeRouter = express.Router();

sizeRouter.get("/getAll", getAllSizes);
sizeRouter.get("/getById/:id",adminAuthMiddleware, getSizeById);
sizeRouter.post("/save",adminAuthMiddleware, saveSize);
sizeRouter.post("/update", adminAuthMiddleware, updateSize);
sizeRouter.post("/delete", adminAuthMiddleware, deleteSize);


module.exports = sizeRouter;
