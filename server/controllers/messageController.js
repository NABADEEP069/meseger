import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import {  io, UserSocketMap } from  "../server.js";

export const getUsersForSidebar = async (req, res)=> {
    try {
        const userId = req.user._id;
        const filterUsers = await User.find({_id: {$ne: userId}}).select("-password");


        const unseenMessages = {}
        const promises = filteredUsers.map(async(user)=> {
            const messages = await Message.find({senderId: user._id, seen: false})
            if(messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success: true, users: filterUsers, unseenMessages})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
    }

export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
         $or: [
            {senderId: myId, receiverId: selectedUserId},
            {senderId: selectedUserId, receiverId: myId},
         ]   
        })
        await Message.updateMany({senderId: selectedUserId, receiverId: myId},
            {seen: true})



    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}



// api to mark message as seen using msg id

export const markMessageAsSeen = async (req, res)=>{
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, {seen: true})
        res.json({success: true})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


export const sendMessage = async (req, res) =>{
    try {
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMesasage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        const receiverSocketId = UserSocketMap[receiverId];
        if (receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMesasage)
        }

        res.json({success: true, newMesasage});

    } catch(error) {
         console.log(error.message);
        res.json({success: false, message: error.message})
    }
}