import express from 'express';
import protect from "../middlewares/authMiddleware.js";
import {accessChat, addToGr, createGroupChat, getChats, removeFromGr, renameGr} from "../controllers/chatCtrl.js";

const router = express.Router();

router.route('/').post(protect, accessChat).get(protect, getChats)
router.route('/group').post(protect, createGroupChat);
router.route('/group/rename').put(protect, renameGr);
router.route('/group/remove').put(protect, removeFromGr);
router.route('/group/add').put(protect, addToGr);

export default router;