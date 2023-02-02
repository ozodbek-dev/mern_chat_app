import 'colors'
import "./config/loadEnv.js"
import express from 'express';
import {chats} from  './data/data.js';
import connectToDB from './config/db.js';

// importing routes
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js';

//Handling error middlewares
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

connectToDB();


const app = express();
app.use(express.json())


app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)



app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4001;



app.listen(PORT,err=>{
  if(err){
    console.log(err)
  }
  console.log(`server has been started on port ${PORT}`.yellow.bgBlue)
})