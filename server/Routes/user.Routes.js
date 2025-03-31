import express from "express";
import { editProfile, login, register } from "../controllers/user.controllers.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
const router = express.Router();

router.get("/register", register);
router.get("/login", login);
router.get("/editProfile", isAuthenticated,editProfile);



export default router;
