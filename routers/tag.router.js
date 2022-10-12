const express = require("express");
const { adminAuthMiddleware } = require("../middlewares/user.auth.middlewares");
const { getAllTags, getTagById, saveTag, updateTag, deleteTag } = require("../controllers/tag.controller")

const tagRouter = express.Router();

tagRouter.get("/getAll", getAllTags);
tagRouter.get("/getById/:id",adminAuthMiddleware, getTagById);
tagRouter.post("/save",adminAuthMiddleware, saveTag);
tagRouter.post("/update", adminAuthMiddleware, updateTag);
tagRouter.post("/delete", adminAuthMiddleware, deleteTag);


module.exports = tagRouter;
