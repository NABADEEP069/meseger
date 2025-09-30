import express from "express";

const app = express();



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
app.listen(5000, console.log("Server is running smoothly"));