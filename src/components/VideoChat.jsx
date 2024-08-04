/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Peer } from "peerjs";
export default function VideoChat() {
    const videosContainerRef = useRef();
    const [stream, setStream] = useState(null);
    const [name, setName] = useState("");
    const [peers, setPeers] = useState([]);
    const [isVideoAllowed, setIsVideoAllowed] = useState(true);
    const [isAudioAllowed, setIsAudioAllowed] = useState(false);
    const socket = useRef(io("http://localhost:3000"));
    const peer = useRef(new Peer(undefined,{port:"3001",host:"/"}))
    const [roomId, setRoomId] = useState("");
    let [isCalling, setIsCalling] = useState(false);
    let userVideoRef = useRef();
    useEffect(() => {
        const currentSocket = socket.current;
        peer.current.on("open", (id) => {
            console.log("connected to peer " + id);
        });
        currentSocket.on("connect", () =>{
            currentSocket.on("connected-users", (data) => {
                setPeers(data.sockets);
                console.log(data);
            });
        });
        return () => {
            currentSocket.off("connect");
            currentSocket.off("is-waiting-for-response");
            currentSocket.off("call-accepted");
            currentSocket.off("user-disconnected");
            currentSocket.off("connected-users");
        };
    }, []);
    useEffect(()=>{
        navigator.mediaDevices.getUserMedia({ video: isVideoAllowed, audio: isAudioAllowed }).then((stream) => {
            setStream(stream);
            userVideoRef.current.srcObject = stream;    
        });
    },[])
    function handleVideoCall(userId){
        const currentSocket = socket.current;
        peer.current.on("call", (call) => {
            call.answer(stream);
            let video = document.createElement("video");
            call.on("stream",(stream)=>{
                addVideoStream(video, stream);
                console.log("stream added");
            })
        });
        currentSocket.emit("connect-to-user",userId);
        currentSocket.on("connected-to-user", (userId) => {
            console.log("connected-to-user");
            connectToNewUser(userId,stream);
        })
    }
    const addVideoStream = (video, stream) => {
        video.srcObject = stream;
        video.setAttribute("controls","");
        video.addEventListener("loadedmetadata", () => {
            video.play();
        });
        videosContainerRef.current.appendChild(video);
    };
    const connectToNewUser = (userId, stream) => {
        if (userId) {
            const call = peer.current.call(userId,stream);
            console.log("calling ", userId);
            const video = document.createElement("video");
            call.on("stream", (userStream) => {
                console.log("video streaming...");
                addVideoStream(video, userStream);
            });
            call.on("close",()=>{
                video.remove()
            })
            peers[userId] = call;
        }
    };
    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            {/* <div className="d-flex flex-column justify-content-center align-items-center">
                {peers.length !== 0 &&
                    peers
                        .filter((item) => item.name !== name)
                        .map((item, index) => (
                            <div key={index} className="d-flex flex-row justify-content-center align-items-center">
                                <button
                                    className={`btn ${isAnswering ? "btn-danger" : "btn-info"}`}
                                    onClick={() => {
                                        if (!isAnswering) {
                                            console.log("is connecting to new user");
                                            callRequest(item.id);
                                        } else {
                                            console.log("is ending call");
                                        }
                                    }}
                                >
                                    {isAnswering ? "end call" : "call"}
                                </button>
                                <p>{item.name}</p>
                                <p>{item.id}</p>
                            </div>
                        ))}
            </div>
            <div className="w-100 d-flex flex-column flex-row justify-content-center align-items-center">
                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" value={roomId} className="form-control" onChange={(e) => setRoomId(e.target.value)} />
                <button
                    className="btn btn-info"
                    onClick={getConnectedUsers}
                    disabled={name.trim() === "" && socket.active && !peer.disconnected}
                >
                    get connected users
                </button>
                <button className="btn btn-secondary">end video call</button>
            </div> */}
            <p>{roomId}</p>
            <input type="text" onChange={(e)=>setRoomId(e.target.value)}/>
            <button onClick={()=>handleVideoCall(roomId)} className="btn btn-info">call</button>
            <div ref={videosContainerRef} className="d-flex flex-row flex-wrap justify-content-center align-items-center">
                <video src="" ref={userVideoRef} controls muted onLoadedMetadata={(e)=>{
                    if(stream){
                        e.target.play();
                    }
                }}></video>
            </div>
        </div>
    );
}