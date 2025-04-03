import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

mongoose.connect(process.env.MONGO_URL, {dbName: 'Edunite'})

const userschema = new mongoose.Schema({
    username : {
        type: String,
        unique: false,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required: true,
        unique : true
    },
    password : String
})

const usermodel = mongoose.model("users", userschema)

export default usermodel