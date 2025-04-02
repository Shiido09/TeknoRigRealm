import express from "express";
import multer from "multer";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary storage for file uploads

router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);

export default router;
