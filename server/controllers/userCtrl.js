import asyncHandler from 'express-async-handler'
import generateToken from '../config/generateToken.js';
import User from '../models/userModel.js';

const registerUser = asyncHandler(async (req, res, next) => {
    const {name, email, password, pic} = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all Fields")
    }

    const userExists = await User.findOne({email})

    if (userExists) {
        res.status(400);
        throw new Error('User Already Exists')
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    })
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(500);
        throw new Error("Failed to Create the user")
    }

})
const authUser = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Please fill all fields")
    }

    const user = await User.findOne({email});

    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(404);
        throw new Error("User Does not found")
    }

})

// /api/user?search=bek
const getAllUsers = asyncHandler(async (req, res, next) => {

    const keyword = req.query.search ? {
        $or: [
            {name: {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}}
        ]
    } : {};

    const users = await User.find(keyword).find({_id: {$ne: req.user._id}})

    res.send(users)

});

export {
    authUser,
    registerUser,
    getAllUsers
}