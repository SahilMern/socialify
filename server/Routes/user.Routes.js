import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  editProfile,
  followOrunfollow,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/register", register); //?User Register
router.post("/login", login); //?User Login
router.delete("/logout", logout); //?User Logout
router.get("/:id/profile", isAuthenticated, getProfile); //?User Profile

router.post(
  "/profile/edit",
  isAuthenticated,
  upload.single("profilePicture"),
  editProfile
); //?User Edit Profile


router.get("/suggested",isAuthenticated, getSuggestedUsers); //?User Suggested

router.post("/followorunfollow/:id",isAuthenticated, followOrunfollow); //?User Suggested


export default router;
