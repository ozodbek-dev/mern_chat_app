import jwt from 'jsonwebtoken';
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {

            token = req.headers.authorization.split(" ")[1];

            //decode token id;
            const decoded = jwt.decode(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password")

            next();
        } catch (err) {
            res.status(401)
            throw new Error(" Not authoized, no token! \n" + `Error: ${err.message}`)
        }
    } else {
        res.status(401);
        throw new Error("You are do not authorized")
    }
})

export default protect;