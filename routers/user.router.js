const express = require("express");
const { userAuthMiddleware, adminAuthMiddleware } = require("../middlewares/user.auth.middlewares");
const userRouter = express.Router();
const { addUser, loginUser, updateUser, getAllUser, updateUserById, deleteUser } = require("../controllers/user.controller")


//Any Emnployee Role
userRouter.post("/", addUser);
userRouter.post("/login", loginUser);
userRouter.put("/", userAuthMiddleware, updateUser);

//For Admin Role
userRouter.get("/", adminAuthMiddleware, getAllUser);
userRouter.put("/:id", adminAuthMiddleware, updateUserById);
userRouter.put("/delete/:id", adminAuthMiddleware, deleteUser);

module.exports = userRouter;
