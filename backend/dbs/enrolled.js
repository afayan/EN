import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

mongoose.connect(process.env.MONGO_URL, {dbName: 'Edunite'})

const enrolledschema = new mongoose.Schema({
    userid : {
        type : String,
    },
    courseid : {
        type : String
    }
})

const enrolledmodel = mongoose.model("enrolled", enrolledschema)

export default enrolledmodel