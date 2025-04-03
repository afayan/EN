import mongoose from "mongoose";
import dotenv from 'dotenv'


dotenv.config()

mongoose.connect(process.env.MONGO_URL, {dbName: "Edunite"})

const actions = new mongoose.Schema({
    video : {
        type : String
    },
    user : {
        type : String
    },
    action : {
        type : String
    }
})

const actionmodel = mongoose.model("actions", actions)

export default actionmodel