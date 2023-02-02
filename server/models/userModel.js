import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique:true
    },
    password: {
      type: String,
      required: true,
    },
    pic:{
      type:String,
      default:"https://w7.pngwing.com/pngs/998/956/png-transparent-profile-pic-illustration-thumbnail.png"
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function(next){
  if(!this.isModified){
    next();
  }

  const salt = await  bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt)

})

userSchema.methods.matchPassword = async function(enteredPassword){
  return bcrypt.compare(enteredPassword,this.password)
}

const User = model("User", userSchema);

export default User;
