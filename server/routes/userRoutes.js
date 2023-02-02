import express from 'express'
import { authUser, registerUser, getAllUsers } from '../controllers/userCtrl.js';
import protect from "../middlewares/authMiddleware.js";
const router = express.Router();

router.route("/register").post(registerUser)
router.route("/login").post(authUser)
router.route("/").get(protect,getAllUsers);

export default router;