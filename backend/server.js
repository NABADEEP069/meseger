import express from "express";
import dotenv from "dotenv";
import chats from "./data/data.js";

const app = express();
dotenv.config();



app.get("/", (req,res) => {
    res.send("API IS RUNNING");
})


app.get("/api/chat", (req, res) => {
    res.send(chats);
})

app.get("api/chat/:id", (req, res) => {
    console.log(req.params.id);
    const singleChat = chats.find((c) => c.id === req.params.id);
    res.send(singleChat); 
})


const port = process.env.PORT || 5000;
app.listen(5000, console.log('Server is running smoothly ${PORT}'));