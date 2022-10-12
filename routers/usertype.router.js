const express = require("express");
const { adminAuthMiddleware } = require("../middlewares/user.auth.middlewares");
const { getAllUserTypes, getUserTypeById, saveUserType, updateUserType, deleteUserType } = require("../controllers/usertype.controller")

const usertypeRouter = express.Router();

usertypeRouter.get("/getAll", getAllUserTypes);
usertypeRouter.get("/getById/:id",adminAuthMiddleware, getUserTypeById);
usertypeRouter.post("/save",adminAuthMiddleware, saveUserType);
usertypeRouter.post("/update", adminAuthMiddleware, updateUserType);
usertypeRouter.post("/delete", adminAuthMiddleware, deleteUserType);


module.exports = usertypeRouter;
