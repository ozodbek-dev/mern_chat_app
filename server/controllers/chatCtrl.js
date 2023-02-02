import asyncHandler from "express-async-handler";
import Chat from "../models/ChatModel.js";
import User from "../models/userModel.js";

const accessChat = asyncHandler(async (req, res, next) => {
    const {userId} = req.body;
    if (!userId) {
        console.log("user Id not sent include request")
        return res.status(400);
    }

    let isChat = await Chat.find({
            isGroupChat: false,
            $and: [{users: {$eq: req.user._id}}, {users: {$eq: userId}}]
        }
    )
        .populate("users", "-password")
        .populate("latestMessage")

    console.log(isChat)
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender", select: "name pic email",
    })

    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        var chatData = {
            chatName: "sender", isGroupChat: false, users: [req.user._id, userId]
        }
        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id: createdChat._id})
                .populate("users", '-password');
            res.status(200).send(FullChat);
        } catch (e) {
            res.status(400)
            throw new Error(error.message);
        }
    }
})
const getChats = asyncHandler(async (req, res, next) => {
    try {
        Chat.find({users: {$eq: req.user._id}})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({updatedAt: 1})
            .then(async results => {
                results = await User.populate(results, {
                    path: "latestMessage.sender", select: "name pic email"
                })
                res.status(200).send(results);
            })
            .catch(err => {
                res.status(400);
                throw new Error("Error: \n " + `${err.message}`);
            })
    } catch (e) {

    }
})
const createGroupChat = asyncHandler(async (req, res, next) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({message: "Please Fill all the fields!"})
    }
    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 usrs are required to from a group chat")
    }
    users.push(req.user)
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name, users: users, isGroupChat: true, groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
            .populate("users", "-password")
            .populate("groupAdmin", '-password');
        res.status(200).json(fullGroupChat);
    } catch (e) {
        res.status(400)
        throw new Error(e.message)
    }
})
const renameGr = asyncHandler(async (req, res, next) => {
    const {chatName, chatId} = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(chatId,
        {chatName},
        {new: true})
        .populate("users", "-password")
        .populate("groupAdmin", '-password')

    if (!updatedChat) {
        res.status(404)
        throw new Error("Chat Not found");
    } else {
        res.json(updatedChat);
    }
})
const removeFromGr = asyncHandler(async (req, res, next) => {
    const {chatId, userId} = req.body;
    const chat = await Chat.findById(chatId);
    console.log(chat.users.find(i => i.toString() === userId.toString()))

    const user = chat.users.find(i => i.toString() === userId.toString());
    if (!user) {
        throw new Error("User Not found In this Group or already this user hase ben deleted from group!")
        return res.status(404);
    }
    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {$pull: {users: userId}},
        {new: true}
    )
        .populate("users", "-password")
        .populate("groupAdmin", '-password');
    if (!removed) {
        res.status(404);
        throw new Error("Chat Not found")
    } else {
        res.json(removed)
    }
})
const addToGr = asyncHandler(async (req, res, next) => {
    const {chatId, userId} = req.body;
    const chat = await Chat.findById(chatId)

    const isAddedAlredy = chat.users.find(i => i.toString() === userId.toString());

    if (isAddedAlredy) {
        return res.send({message: "This User Alredy has been joined"})
    }

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {$push: {users: userId}},
        {new: true}
    )
        .populate("users", "-password")
        .populate("groupAdmin", '-password');

    if (!added) {
        res.status(404);
        throw new Error("Chat Not found")
    } else {
        res.json(added)
    }
})

export {
    accessChat, getChats, createGroupChat, renameGr, removeFromGr, addToGr
}