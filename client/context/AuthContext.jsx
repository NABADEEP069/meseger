import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Get backend URL and remove trailing slash if present
const rawBackendUrl = import.meta.env.VITE_BACKEND_URL || "";
const backendUrl = rawBackendUrl.endsWith('/') ? rawBackendUrl.slice(0, -1) : rawBackendUrl;
axios.defaults.baseURL = backendUrl;

// Log error if backend URL is not set (helps with debugging)
if (!import.meta.env.VITE_BACKEND_URL) {
  console.error("⚠️ VITE_BACKEND_URL is not set! API calls will fail. Please set this environment variable in Vercel.");
} else {
  console.log("✅ Backend URL configured:", backendUrl);
}

export const AuthContext = createContext();
export const AuthProvider = ({ children })=>{

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setsocket] = useState(null);


    const checkAuth = async () => {
        try {
            if (!backendUrl) {
                console.error("⚠️ Backend URL not configured. Please set VITE_BACKEND_URL in Vercel environment variables.");
                return;
            }
            const { data } = await axios.get("/api/auth/check");
            if (data.success) {
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            if (!backendUrl) {
                toast.error("Backend URL not configured. Check environment variables.");
            } else {
                const errorMessage = error.response?.data?.message || error.message;
                toast.error(errorMessage);
            }
        }
    }

    const login = async (state, credentials)=>{
        try {
            if (!backendUrl) {
                toast.error("Backend URL not configured. Please set VITE_BACKEND_URL in Vercel.");
                return;
            }
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token)
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
                toast.error(`Network Error: Cannot connect to backend. Check if VITE_BACKEND_URL is set correctly.`);
            } else {
                const errorMessage = error.response?.data?.message || error.message;
                toast.error(errorMessage);
            }
        }
    }

    const logout = async () =>{
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged out successfully")
        socket.disconnect();
    }


  
    const updateProfile = async (body)=>{
        try {
            const { data } = await axios.put("/api/auth/updateProfile", body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile update successful")
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
        }
    }

    const connectSocket = (userData)=>{
        if(!userData || socket?.connected) return;
        if(!backendUrl) {
            console.error("⚠️ Cannot connect Socket.io: VITE_BACKEND_URL is not set");
            return;
        }
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        });
        newSocket.connect();
        setsocket(newSocket);

        newSocket.on("getOnlineUsers", (userIds)=>{
            setOnlineUsers(userIds);
        })
    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"] = token;
        }
        checkAuth()
    },[])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}