import { createContext, use, useEffect } from "react";
import { useState, useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({ children })=>{
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null)
    const [unseenMessages, setUnseenMessages] = useState({})

    const {socket, axios} = useContext(AuthContext);

  
    const getUsers = async () => {
       try {
           const { data } = await axios.get("/api/messages/users");
           if (data.success){
               setUsers(data.users)
               setUnseenMessages(data.unseenMessages)
           }
       } catch (error) {
           if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
               toast.error("Network Error: Cannot connect to backend");
           } else {
               toast.error(error.response?.data?.message || error.message);
           }
       }
    }
    const getMessages = async (userId) => {
        try {
           const { data } =  await axios.get(`/api/messages/${userId}`);
            if (data.success) {
               setMessages(data.messages);
           }
        } catch (error) {
            if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
                toast.error("Network Error: Cannot connect to backend");
            } else {
                toast.error(error.response?.data?.message || error.message);
            }
        }
    }

    const sendMessage = async (messageData) => {
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
           
                setMessages((prevMessages) => [...prevMessages, data.message])
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
                toast.error("Network Error: Cannot send message. Check backend connection.");
            } else {
                toast.error(error.response?.data?.message || error.message);
            }
        }
    }  

   
    const subscribeToNewMessages = () => {
        if(!socket) return;

        socket.on("newMessage", (newMessage) => {
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }else{
               setUnseenMessages((prevUnseenMessages)=>({
                ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
               })) 
            }
        })
    }

    const unsubscribeFromNewMessages = () => {  
        if(socket) socket.off("newMessages");
    }

    useEffect(()=>{
        subscribeToNewMessages();
        return ()=> unsubscribeFromNewMessages();
    },[socket, selectedUser])

     const value = {
        messages, users, selectedUser, getUsers, getMessages, sendMessage, setSelectedUser, unseenMessages, setUnseenMessages
     }


    return (
    <ChatContext.Provider value={value}>
        { children }
    </ChatContext.Provider>
    )
}