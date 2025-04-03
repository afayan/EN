import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

mongoose.connect(process.env.MONGO_URL, {dbName: "Edunite"})


const comments = new mongoose.Schema({
    videodata : {
        type : String
    },
    comment : {
        type : String
    },
    user : {
        type : String
    },
    date : {
        type : Date,
        default : Date.now
    }
})


const commentsmodel = mongoose.model("comments", comments)

export default commentsmodel