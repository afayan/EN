import mongoose from "mongoose";

const videoschema = new mongoose.Schema({
    title : {
        type : String
    },
    videoUrl : {
        type : String
    },
    courseid : {
        type : String
    },
    description : {
        type : String
    }
})

const videomodel = mongoose.model("videos", videoschema)

export default videomodel