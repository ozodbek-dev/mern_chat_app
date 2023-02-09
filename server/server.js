import 'colors'
import "./config/loadEnv.js"
import express from 'express';
import connectToDB from './config/db.js';
import cors from 'cors'
// importing routes
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js';

//Handling error middlewares
import {errorHandler, notFound} from './middlewares/errorMiddleware.js';
import messageRoutes from "./routes/messageRoutes.js";
import {Server} from 'socket.io';

connectToDB();


const app = express();
app.use(cors())
app.use(express.json())


app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4001;


const server = app.listen(PORT, err => {
    if (err) {
        console.log(err)
    }
    console.log(`server has been started on port ${PORT}`.yellow.bgBlue)
})

const io = new Server(server, {
    pingTimeout: 60000, cors: {
        origin: "http://localhost:3000"
    }
})

io.on("connection", (socket) => {
    console.log("Connected to socket.io".green)

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        console.log(userData._id)
        socket.emit("connected")
    })

    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("User Joined Room: " + room)
    })

    socket.on("new message", (data) => {

        let chat = data.chat

        if (!chat.users) {
            return console.log("chat.users not defined")
        }
        chat.users.forEach((user) => {
            if (user._id == data.sender._id) return
            socket.in(user._id).emit("received msg", data)
        })
    })

    socket.on('typing', room => socket.in(room).emit('typing'))
    socket.on('stop typing', room => socket.in(room).emit('stop typing'))


    socket.off('setup', (userData) => {
        console.log('user disconnected');
        socket.leave = userData._id
    })
})