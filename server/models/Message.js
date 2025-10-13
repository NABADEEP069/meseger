import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    fullName: {type: String, required: true},
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
    bio: { type: String },
}, { timestamps: true })


const Message = mongoose.model("Message", messageSchema);

export default Message;
