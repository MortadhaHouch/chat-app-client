/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ChatHeader from "./ChatHeader";
import Aside from "./Aside";
import ProfilePanel from "./ProfilePanel";
import { IoIosSend } from "react-icons/io";
import SwiperElement from "./SwiperElement";
export default function Chat() {
    const socket = useRef(io("http://localhost:3000"));
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [room, setRoom] = useState("");
    const [name, setName] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [disconnectionReason, setDisconnectionReason] = useState("");
    const [connections, setConnections] = useState(0);
    let [isMessageReceived, setIsMessageReceived] = useState(false);
    let [isTyping,setIsTyping] = useState(false);
    let [otherUser,setOtherUser] = useState(null);
    const lastMessageRef = useRef();
    let [users,setUsers] = useState([]);
    useEffect(()=>{
        setIsMessageReceived(isMessageReceived);
        return ()=> setIsMessageReceived(false);
    },[isMessageReceived])
    useEffect(()=>{
        setIsTyping(isTyping)
        return ()=>setIsTyping(false);
    },[isTyping])
    useEffect(() => {
        const currentSocket = socket.current;
        currentSocket.on("connect", () => {
            setIsConnected(currentSocket.active);
            currentSocket.on("connection-established", (connection) => {
                setConnections(connection);
            });
        });
        currentSocket.on("disconnect", (reason) => {
            setDisconnectionReason(reason);
            handleDisconnect(reason);
        });
        currentSocket.on("room-joined", (message, data) => {
            if (message && data) {
                setConnections(data.connections);
            }
        });
        currentSocket.on("user-disconnection-encountered", (message, data) => {
            setConnections(data.connections);
            console.log(message);
            console.log(data);
        });
        currentSocket.on("server-error-encountered", (message, data) => {
            setConnections(data.connections);
            console.log(message);
            console.log(data);
        });
        currentSocket.on("response-timeout-encountered", (message, data) => {
            setConnections(data.connections);
            console.log(message);
            console.log(data);
        });
        currentSocket.on("transport-closure-encountered", (message, data) => {
            setConnections(data.connections);
            console.log(message);
            console.log(data);
        });
        currentSocket.on("transport-error-encountered", (message, data) => {
            setConnections(data.connections);
            console.log(message);
            console.log(data);
        });
        currentSocket.on("message-received", (data) => {
            if (data) {
                setConnections(data.connections);
                if(data.message){
                    setMessages((prevMessages) => [...prevMessages, data]);
                    setIsMessageReceived(true);
                }else{
                    setIsMessageReceived(false);
                }
            }
        });
        currentSocket.on("is-user-typing",(data)=>{
            if(data){
                setOtherUser(data);
            }
        })
        currentSocket.on("user-not-typing",(data)=>{
            if(data){
                setOtherUser(data);
                setIsTyping(false);
            }
        })
        return () => {
            currentSocket.off("connect");
            currentSocket.off("disconnect");
            currentSocket.off("room-joined");
            currentSocket.off("user-disconnection-encountered");
            currentSocket.off("server-error-encountered");
            currentSocket.off("response-timeout-encountered");
            currentSocket.off("transport-closure-encountered");
            currentSocket.off("transport-error-encountered");
            currentSocket.off("message-received");
        };
    }, []);
    const handleDisconnect = (reason) => {
        const currentSocket = socket.current;
        switch (reason) {
            case "io client disconnect":
                currentSocket.emit("disconnect-user", { user: currentSocket.id, time: currentSocket.id ? { date: Date.now(), user: currentSocket.id } : null, connections });
                break;
            case "io server disconnect":
            case "parse error":
            case "ping timeout":
            case "transport close":
            case "transport error":
                currentSocket.emit(reason, { user: currentSocket.id, time: currentSocket.id ? { date: Date.now(), user: currentSocket.id } : null, connections });
                break;
            default:
                break;
        }
    };
    const sendMessage = () => {
        if (message.trim() !== "" && name.trim() !== "") {
            setMessages((prev)=>[...prev,{ message, room, name, date: Date.now(), connections }]);
            lastMessageRef.current?.scrollIntoView({behavior:"smooth",top:lastMessageRef.current?.getBoundingClientRect().x+lastMessageRef.current?.getBoundingClientRect().height});
            socket.current.emit("message", { message, room, name, date: Date.now(), connections });
            setMessage("");
        }
    };
    const joinRoom = () => {
        if (room.trim() !== "" && name.trim() !== "") {
            socket.current.emit("join-room", { room, name, date: Date.now(), connections });
        }
    };
    return (
        <main className="w-100 h-auto d-flex flex-row justify-content-center align-items-center">
            <ChatHeader/>
            <Aside/>
            <ProfilePanel/>
            <SwiperElement/>
            <form className="w-100 h-auto position-fixed bottom-0 d-flex flex-row justify-content-center align-items-center p-3">
                <div className="w-100 h-auto">
                    <input type="text" id="message-box" onChange={(e)=>setMessage(e.target.value)} className="form-control w-100"/>
                </div>
                <button className={`btn btn-info ${!message && "disabled"}`} type="submit">
                    <IoIosSend/>
                </button>
            </form>
        </main>
    );
}