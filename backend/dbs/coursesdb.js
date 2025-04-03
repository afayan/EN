import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

mongoose.connect(process.env.MONGO_URL, {dbName: 'Edunite'})

const courseschema = new mongoose.Schema({
    cname : {
        type : String,
        required : true,
        trim : true,
        unique : true
    },
    category : {
        type : String,
        required : true,
        trim : true
    },
    faculty: {
        type : String,
        required : true
    },
    created : {
        type : Date,
        default : Date.now
    },
    description : {
        type : String
    },
    creator : {
        type : String
    }
})

const coursemodel = mongoose.model("courses", courseschema)

export default coursemodel