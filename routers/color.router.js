const express = require("express");
const { adminAuthMiddleware } = require("../middlewares/user.auth.middlewares");
const { getAllColors, getColorById, saveColor, updateColor, deleteColor } = require("../controllers/color.controller")

const colorRouter = express.Router();

colorRouter.get("/getAll", getAllColors);
colorRouter.get("/getById/:id",adminAuthMiddleware, getColorById);
colorRouter.post("/save",adminAuthMiddleware, saveColor);
colorRouter.post("/update", adminAuthMiddleware, updateColor);
colorRouter.post("/delete", adminAuthMiddleware, deleteColor);


module.exports = colorRouter;
