import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);


export const io = new Server(server, {
    cors: {origin: "*"}
})


export const UserSocketMap = {};

io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if(userId) UserSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(UserSocketMap));

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", userId);
        delete UserSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(UserSocketMap))
    })
})


app.use(express.json({ limit: '4mb' }));
app.use(cors());


app.use("/api/status", (req, res) => res.send("server is running"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);



await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is running on port: " + PORT));
