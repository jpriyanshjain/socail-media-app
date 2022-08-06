import mongoose from "mongoose";


const postSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    likes: [],
    image: String,
    desc: String
},
    { timestamps: true }
)

const postModel = mongoose.model("Posts", postSchema);
export default postModel;