import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";

const newMessage = asyncHandler(async (req, res, next) => {
    const {chatId, content} = req.body;
    if (!chatId || !content) {
        res.status(500)
        throw new Error("Chat id or message Content not defined")
    }

    const message = await Message.create({
        sender: req.user._id,
        content,
        chat: chatId
    })

    const fullMessage = await Message.findOne({_id: message._id})
        .populate("sender", "-password").populate("chat")

    res.status(201).json(fullMessage)
})
const getAllMessages = asyncHandler(async (req, res, next) => {
    const messages = await Message.find({chat: req.params.id}).populate("sender", "-password")
    res.status(200).json(messages)
})

export {
    newMessage, getAllMessages
}