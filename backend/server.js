import express from "express";
const dotenv = require("dotenv");


const app = express();
dotenv.config();



app.get("/", (req,res) => {
    res.send("API IS RUNNING");
})


app.get("/v1/chats", (req,res) => {
    res.send(chats);
})

app.get("v1/chats/:id", (req, res) => {
    console.log(req.params.id);
    const singleChat = chats.find((c) => c.id === req.params.id);
    res.send(singleChat); 
})


const port = process.env.PORT || 5000;
app.listen(5000, console.log('Server is running smoothly ${PORT}'));