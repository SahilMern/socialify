import express from "express";
const router = express.Router();

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";
import { addNewPost, getAllPost, getUserPost } from "../controllers/post.controller.js";

router.post("/addpost", isAuthenticated, upload.single("image"), addNewPost);
router.get("/all", isAuthenticated, getAllPost);
router.get("/userpost/all", isAuthenticated, getUserPost);


export default router;
