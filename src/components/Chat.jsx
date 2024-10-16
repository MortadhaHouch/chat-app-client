/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ChatHeader from "./ChatHeader";
import Aside from "./Aside";
import ProfilePanel from "./ProfilePanel";
import { IoIosSend } from "react-icons/io";
import SwiperElement from "./SwiperElement";
import { ThemeContext } from "../../providers/ThemeContextProvider";
import {v4} from "uuid"
import { MdOutlineEdit } from "react-icons/md";
import {useCookies} from "react-cookie"
import { IoIosCall } from "react-icons/io";
import { MdOutlineVideoCall } from "react-icons/md";
import moment from "moment"
export default function Chat() {
    let [cookie,setCookie,removeCookie] = useCookies(["jwt_token"]);
    const socket = useRef(io("http://localhost:3000",{
        auth:{
            token:cookie.jwt_token
        }
    }));
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [disconnectionReason, setDisconnectionReason] = useState("");
    let [discussion,setDiscussion] = useState(null);
    const [connections, setConnections] = useState(0);
    let [isMessageReceived, setIsMessageReceived] = useState(false);
    let theme = useContext(ThemeContext);
    useEffect(() => {
        if (discussion) {
            const currentSocket = socket.current;
            console.log("Joining room " + discussion.id);
            // Emit join-room request to the server
            currentSocket.emit("join-room", { discussionId: discussion.id });
            // Handle room-joined event (to confirm successful room join)
            const handleRoomJoined = ({ discussionId }) => {
                console.log("Joined room: " + discussionId);
                if (discussion.id === discussionId) {
                    setMessages((prev) => [...prev]); // Refresh messages
                }
            };
            currentSocket.on("room-joined", handleRoomJoined);
            // Cleanup listeners on component unmount or re-render
            return () => {
                currentSocket.off("room-joined", handleRoomJoined);
            };
        }
    }, [discussion]);
    let [friends, setFriends] = useState([]);
    let [groups, setGroups] = useState([]);
    let [friendRequests,setFriendRequests] = useState([]);
    let [groupRequests,setGroupRequests] = useState([]);
    let [notifications,setNotifications] = useState([]);
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
        console.log(friends);
    },[friends])
    useEffect(()=>{
        console.log(groups);
    },[groups])
    useEffect(() => {
        const currentSocket = socket.current;
        const handleReceiveMessage = async (data) => {
            lastMessageRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
            setMessages((prev) => [...prev, data]);
            console.log(data);
            setMessage("");
        };
        currentSocket.on("receive-message", handleReceiveMessage);
        return () => {
            currentSocket.off("receive-message");
            currentSocket.off("connect");
            currentSocket.off("disconnect");
            currentSocket.off("user-disconnection-encountered");
            currentSocket.off("server-error-encountered");
            currentSocket.off("response-timeout-encountered");
            currentSocket.off("transport-closure-encountered");
            currentSocket.off("transport-error-encountered");
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
    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() !== "" && discussion!==null && discussion.id.trim() !== "") {
            socket.current.emit("send-message", { message ,discussionId:discussion.discussionId });
        }
    };
    const groupMessagesByDay = (messages) => {
        return messages.reduce((acc, message) => {
            const day = moment(message.createdAt).format("YYYY-MM-DD");
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(message);
            return acc;
        }, {});
    };
    return (
        <main className="w-100 d-flex flex-row justify-content-center align-items-center"
            style={{
                backgroundColor:(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"#2E236C":"#FBF9F1",
                minHeight:"100vh"
            }}>
            <ChatHeader/>
            <Aside 
                friends={friends} 
                setFriends={setFriends} 
                groups={groups} 
                setGroups={setGroups} 
                discussion={discussion} 
                setDiscussion={setDiscussion}
                friendRequests={friendRequests}
                setFriendRequests={setFriendRequests}
                groupRequests={groupRequests}
                setGroupRequests={setGroupRequests}
                notifications={notifications}
                setNotifications={setNotifications}
                messages={messages}
                setMessages={setMessages}
            />
            <ProfilePanel/>
            <section 
                className="w-100 d-flex flex-column justify-content-start align-items-center gap-2 p-2"
                style={{
                    maxHeight:"90vh",
                    overflowY:"scroll"
                }}
            >
                {
                    discussion ? (
                        <>
                            <img 
                                src={discussion.friendAvatar} 
                                alt="" 
                                style={{
                                    border:`${discussion.isLoggedIn?"5px solid green":"5px solid red"}`,
                                    width:150,
                                    aspectRatio:1,
                                    borderRadius:"50%"
                                }}/>
                            <h3 className={`${theme.isDark||JSON.parse(localStorage.getItem("isDark"))?"text-light":"text-dark"}`}>{discussion.username}</h3>
                            <div>
                                <button disabled={!discussion.isVideoCalling} className="btn btn-primary">
                                    <MdOutlineVideoCall/>
                                </button>
                                <button disabled={!discussion.isAudioCalling} className="btn btn-secondary">
                                    <IoIosCall/>
                                </button>
                            </div>
                            {
                                messages && messages.length > 0 ? (
                                    Object.keys(groupMessagesByDay(messages)).map((item,index)=>{
                                        let date = new Date(item);
                                        const formattedDate = moment(date).format("MMMM Do YYYY");
                                        return (
                                            <div key={index} className="messages-container">
                                                <span className="date-display">
                                                    {formattedDate}
                                                </span>
                                                {
                                                    item && Object.values(groupMessagesByDay(messages))[index].map((message,i)=>{
                                                        let messageDate = new Date(message.createdAt);
                                                        const messageFormattedDate = moment(messageDate).format("h:mm:ss a");
                                                        return (
                                                            <>
                                                                {
                                                                    message.messageIsMine ?(
                                                                        <div 
                                                                            className="message-container gap-2" 
                                                                            key={i}
                                                                            style={{
                                                                                justifyContent:message.messageIsMine?"flex-end":"flex-start",
                                                                            }}
                                                                        >
                                                                            <div 
                                                                                ref={index == messages.length - 1?lastMessageRef:null}
                                                                                className="message"
                                                                                style={{
                                                                                    backgroundColor:message.messageIsMine?"#024CAA":"#F4F6FF",
                                                                                }}
                                                                            >
                                                                                <p className="text-light">{message.content}</p>
                                                                                {
                                                                                    message.messageIsMine && (
                                                                                        <MdOutlineEdit />
                                                                                    )
                                                                                }
                                                                                <span style={{color:"rgba(255,255,255,.75)"}}>
                                                                                    {messageFormattedDate}
                                                                                </span>
                                                                            </div>
                                                                            <img 
                                                                                src={localStorage.getItem("avatar")} 
                                                                                alt="" 
                                                                                style={{
                                                                                    border:`${discussion.isLoggedIn?"2px solid green":"2px solid red"}`,
                                                                                    width:50,
                                                                                    height:50,
                                                                                    borderRadius:"50%"
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    ):(
                                                                        <div 
                                                                            className="message-container gap-2" 
                                                                            key={i}
                                                                        >
                                                                            <img 
                                                                                src={discussion.friendAvatar} 
                                                                                alt="" 
                                                                                style={{
                                                                                    border:`${discussion.isLoggedIn?"2px solid green":"2px solid red"}`,
                                                                                    width:50,
                                                                                    height:50,
                                                                                    borderRadius:"50%"
                                                                                }}
                                                                            />
                                                                            <div 
                                                                                ref={index == messages.length - 1?lastMessageRef:null}
                                                                                className="message"
                                                                                style={{
                                                                                    backgroundColor:message.messageIsMine?"#77CDFF":"#DBD3D3",
                                                                                    alignSelf:message.messageIsMine?"flex-end":"flex-start",
                                                                                }}
                                                                            >
                                                                                <p>{message.content}</p>
                                                                                {
                                                                                    message.messageIsMine && (
                                                                                        <MdOutlineEdit />
                                                                                    )
                                                                                }
                                                                                <span>
                                                                                    {messageFormattedDate}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            </>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                ):(
                                    <p className={theme.isDark|| JSON.parse(localStorage.getItem("isDark"))?"text-light":"text-dark"}>No Messages yet</p>
                                )
                            }
                        </>
                    ):(
                        <SwiperElement/>
                    )
                }
            </section>
            <form 
                onSubmit={sendMessage} 
                className="position-fixed d-flex flex-row justify-content-center align-items-center p-3" 
                style={{
                    bottom:discussion?"0":"-200px",
                    width:"clamp(300px, 60vw, 800px)",
                    backgroundColor:(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"#2E236C":"#FBF9F1",
                }}>
                <div className="w-100 h-auto">
                    <input 
                        type="text" 
                        id="message-box" 
                        value={message} 
                        onChange={(e)=>setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="form-control w-100"
                    />
                </div>
                <button className={`btn btn-info ${!message && "disabled"}`} type="submit">
                    <IoIosSend/>
                </button>
            </form>
        </main>
    );
}