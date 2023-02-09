import express from 'express'
import protect from "../middlewares/authMiddleware.js";
import {getAllMessages, newMessage} from "../controllers/messageCtrl.js";


const router = express.Router()


router.route("/").post(protect, newMessage)
router.route("/:id").get(protect, getAllMessages)

export default router;