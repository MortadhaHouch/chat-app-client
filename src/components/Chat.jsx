/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ChatHeader from "./ChatHeader";
import Aside from "./Aside";
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
    let [isShown,setIsShown] = useState(false);
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
    useEffect(()=>{
        setIsShown(isShown);
        if(isShown==false){
            socket.current.emit("get-connected-users",{ room, name, date: Date.now(), connections })
            socket.current.on("connected-users",(data)=>{
                setUsers(data.sockets);
            })
        }
    },[isShown])
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
        <main>
            <ChatHeader name={name} isConnected={isConnected} connections={connections} isShown={isShown} setIsShown={setIsShown}/>
            {
                <Aside isShown={isShown} users={users}/>
            }
            <section className="d-flex flex-column justify-content-center align-items-center gap-1 w-100"></section>
            <section className="d-flex flex-column justify-content-center align-items-center g-1 messages-container">
                {messages.map((item, index) => {
                    const formattedDate = new Date(item.date).toLocaleTimeString();
                    return (
                        <div key={index} className={`card ${index === messages.length - 1 ? "last-message" : ""}`} ref={index === messages.length - 1 ? lastMessageRef : null}>
                            <span>{item.name} {formattedDate}</span>
                            <p className={`${isMessageReceived?"text-bg-success":"text-bg-danger"}`}>{item.message}</p>
                        </div>
                    );
                })}
            </section>
            <section className="d-flex flex-column justify-content-center align-items-center w-100 message-controls">
                <div className="w-75">
                    <p className="w-100 bg-danger-subtle">{disconnectionReason}</p>
                    {
                        (otherUser && isTyping) && (
                            <p className="w-100 text-bg-info">{otherUser.name} is typing...</p>
                        )
                    }
                </div>
                <div className="w-75">
                    <input className="form-control" type="text" value={name} placeholder="Name" onChange={(e) => setName(e.target.value)} /><br />
                </div>
                <div className="w-75">
                    <input className="form-control w-75" type="text" value={message} placeholder="Message" 
                    onChange={(e) => {
                        setMessage(e.target.value);
                        setIsTyping(true);
                        setTimeout(()=>{
                            socket.current.emit("is-typing",{ room, name, date: Date.now(), connections ,isTyping});
                        },1000)
                    }}
                    onBlur={()=>{
                        setIsTyping(false);
                        socket.current.emit("is-not-typing",{ room, name, date: Date.now(), connections ,isTyping});
                    }}
                    /><br />
                    <button className={`btn btn-info w-25 ${message && name ? "" : "disabled"}`} onClick={sendMessage}>Send Message</button><br />
                </div>
                <div className="w-75">
                    <input className="form-control w-75" type="text" value={room} placeholder="Room" onChange={(e) => setRoom(e.target.value)} /><br />
                    <button className={`btn btn-info w-25 ${room && name ? "" : "disabled"}`} onClick={joinRoom}>Join Room</button>
                </div>
            </section>
        </main>
    );
}