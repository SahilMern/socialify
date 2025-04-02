import express from "express";
const router = express.Router();

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { getMessage, sendMessage } from "../controllers/message.controller.js";

router.post("/send/:id",isAuthenticated, sendMessage); 
router.get("/all/:id",isAuthenticated, getMessage); 


export default router;
