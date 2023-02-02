import mongoose from 'mongoose';

const connectToDB = async ()=>{
  try {
    const con = await mongoose.connect(process.env.DB_URL,{
      useNewUrlParser:true,
      useUnifiedTopology:true
    })
    console.log(`DB Connected : ${con.connection.host} ...`.yellow.bold);
  } catch (err) {
      console.log(`Error: ${err.message}`.red)
      process.exit()
  }
}


export default connectToDB;