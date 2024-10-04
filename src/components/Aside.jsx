/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { IoIosArrowForward,IoIosArrowBack, IoMdExit } from "react-icons/io";
import { MdAdd, MdBlock, MdCancel, MdCreate, MdEdit, MdGroups, MdPreview, MdRemove, MdSearch, MdUpload } from "react-icons/md";
import {  FaInfoCircle, FaSearch, FaUser } from "react-icons/fa";
import { fetchData } from "../../utils/fetchData";
import { jwtDecode } from "jwt-decode";
import { FaFile } from "react-icons/fa";
import { ThemeContext } from "../../providers/ThemeContextProvider";
import Popup from "./Popup";
import { IoMdTime } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import NoDataFoundIcon from "../icons/NoDataFoundIcon";
import { CiLock, CiRepeat, CiUnlock } from "react-icons/ci";
import {debounce} from "../../utils/rateLimiter";
import { RiGroupLine, RiProfileLine } from "react-icons/ri";
import Toast from "./Toast";
import fileReading from "../../utils/fileReading";
export default function Aside(props) {
    let [isShown,setIsShown] = useState(false);
    let [isPopupShown,setIsPopupShown] = useState(false);
    let [toastShown,setIsToastShown] = useState(false);
    let [componentName,setComponentName] = useState("friends");
    let [dataCategory,setDataCategory] = useState("users");
    let [groupCategory,setGroupCategory] = useState("joined");
    let [isLoading,setIsLoading] = useState(false);
    let [foundUsers,setFoundUsers] = useState([]);
    let [foundGroups,setFoundGroups] = useState([]);
    let [groupRequests,setGroupRequests] = useState([]);
    let [userName,setUserName] = useState("");
    let [groupName,setGroupName] = useState("");
    let [groupNameToCreate,setGroupNameToCreate] = useState("");
    let [isGroupPrivate,setIsGroupPrivate] = useState(false);
    let [message,setMessage] = useState("");
    let [error,setError] = useState("");
    let [avatar,setAvatar] = useState("");
    let userRequestRefs = useRef([]);
    let theme = useContext(ThemeContext);
    useEffect(()=>{
        console.log(dataCategory);
        if(isLoading){
            setIsLoading(false);
        }
    },[dataCategory,groupCategory]);

    // const handleSearch = useCallback(
    //     debounce(async(data) => {
    //         try {
    //             let request = await fetchData(`/groups/search?name=${data}`,"GET",null,"json",setIsLoading);
    //             let response = jwtDecode(request.token).items;
    //             setFoundUsers(response);
    //             console.log(foundUsers);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }, 1000), []
    // );
    // const handleChange = (event) => {
    //     setUserName(event.target.value);
    //     handleSearch(event.target.value);
    // };
    let userSearchTabRef = useRef();
    let groupSearchTabRef = useRef();
    return (
        <aside 
            className={`aside left-aside ${isShown?"shown":"hidden"}`}
            style={{
                backgroundColor:(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"#17153B":"#E5E1DA",
            }}
            >
            <button className="btn btn-info d-flex flex-column justify-content-center align-items-center" style={{
                position:"absolute",
                top:100,
                right:"-30px"
            }} onClick={()=>setIsShown(val=>!val)}>{isShown?<IoIosArrowForward />:<IoIosArrowBack />}</button>
            <div className="w-100 d-flex flex-row justify-content-center align-items-center" style={{gap:10}}>
                <button className={`btn ${componentName == "friends"?"btn-info":"btn-secondary"} w-50 d-flex flex-column justify-content-center align-items-center`}
                    onClick={async()=>{
                        setComponentName("friends");
                        try {
                            let request = await fetchData("/user/friends","GET",null,"json",setIsLoading);
                            props.setFriends(jwtDecode(request.token).friends);
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                ><FaUser size={20}/><span>friends</span></button>
                <button className={`btn ${componentName == "groups"?"btn-info":"btn-secondary"} w-50 d-flex flex-column justify-content-center align-items-center`}
                    onClick={async()=>{
                        setComponentName("groups");
                        try {
                            let request = await fetchData("/groups/joined","GET",null,"json",setIsLoading);
                            props.setGroups(jwtDecode(request.token).joinedGroups);
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                ><MdGroups size={20}/><span>groups</span></button>
                <button className={`btn ${componentName == "notifications"?"btn-info":"btn-secondary"} w-50 d-flex flex-column justify-content-center align-items-center`}
                    onClick={async()=>{
                        setComponentName("notifications");
                        try {
                            let request = await fetchData("/user/notifications","GET",null,"json",setIsLoading);
                            props.setNotifications(jwtDecode(request.token).userNotifications);
                            console.log(props.notifications);
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                ><IoIosNotifications size={20}/><span>notifications</span></button>
            </div>
            {
                componentName == "friends" &&(
                    <section className="messages">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link active"
                                    id="friends-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#friends"
                                    type="button"
                                    role="tab"
                                    aria-controls="friends"
                                    aria-selected="true"
                                    onClick={async()=>{
                                        setDataCategory("users");
                                        try {
                                            let request = await fetchData("/user/friends","GET",null,"json",setIsLoading);
                                            console.log(jwtDecode(request.token).friends);
                                            props.setFriends(jwtDecode(request.token).friends);
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }}
                                >
                                    <FaUser size={20}/> friends
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link"
                                    id="requests-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#requests"
                                    type="button"
                                    role="tab"
                                    aria-controls="requests"
                                    aria-selected="false"
                                    onClick={async()=>{
                                        setDataCategory("requests");
                                        try {
                                            let request = await fetchData("/user/requests","GET",null,"json",setIsLoading);
                                            props.setFriendRequests(jwtDecode(request.token).friendRequests);
                                            console.log(props.friendRequests);
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }}
                                >
                                    <MdAdd size={20}/> requests
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link"
                                    id="search-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#search"
                                    type="button"
                                    role="tab"
                                    aria-controls="search"
                                    aria-selected="false"
                                    ref={userSearchTabRef}
                                    onClick={()=>{
                                        setDataCategory("search");
                                    }}
                                >
                                    <FaSearch size={20}/> search
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content w-100">
                            {
                                dataCategory == "users" && (
                                    <div
                                        className="tab-pane active d-flex flex-column justify-content-center align-items-center w-100"
                                        id="friends"
                                        role="tabpanel"
                                        aria-labelledby="friends-tab"
                                    >
                                        {
                                            isLoading ?(
                                                <span className="loader"></span>
                                            ):(
                                                props.friends && props.friends.length !== 0 ?(
                                                    props.friends.map((item,index)=>{
                                                        return(
                                                            <div 
                                                                key={index} 
                                                                title={item.email} 
                                                                className={`message-preview ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}
                                                                style={{
                                                                    backgroundColor:(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"#17153B":"#E5E1DA",
                                                                    borderRadius:"10px 0px 0px 10px"
                                                                }}
                                                                id={item.id}
                                                                onClick={()=>{
                                                                    props.setDiscussion(item);
                                                                    props.setMessages(item.discussionObject.messages);
                                                                }}
                                                            >
                                                                <img src={item.friendAvatar} style={{border:`2px solid ${item.isLoggedIn?"green":"red"}`,borderRadius:"10px"}} alt="" />
                                                                <strong>{item.name}</strong>
                                                                {
                                                                    Object.keys(item.discussionObject).length !==0 ? (
                                                                        <>
                                                                            <p className={`${(theme.isDark||JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>
                                                                            {item.discussionObject.messageIsMine?<strong>Me :</strong>:item.name}
                                                                                {
                                                                                    item.discussionObject.content.length !== 0 ? item.discussionObject.content.slice(0,10)+"...":
                                                                                    item.files && item.files!==0 && (
                                                                                        <span>{item.files} <FaFile/></span>
                                                                                    )
                                                                                }
                                                                            </p>
                                                                            <span>{item.discussionObject.unseenMessagesCount}</span>
                                                                        </>
                                                                    ):(
                                                                        <p style={{
                                                                            backgroundColor:(theme.isDark||JSON.parse(localStorage.getItem("isDark")))?"rgba(0, 128, 0, 0.25)":"rgba(0, 191, 255, 0.25)",
                                                                            color:(theme.isDark||JSON.parse(localStorage.getItem("isDark")))?"rgba(0, 128, 0, 1)":"rgba(0, 191, 255, 1)",
                                                                            borderRadius:"10px",
                                                                            padding:"5px",
                                                                            border:"2px solid green"
                                                                        }}>
                                                                            start chatting
                                                                        </p>
                                                                    )
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                ):(
                                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                                        <h3 className={`text-center ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>You didn&apos;t make any friendship</h3>
                                                        <NoDataFoundIcon/>
                                                        <button className="btn btn-primary" 
                                                            onClick={()=>{
                                                                setDataCategory("search");
                                                                userSearchTabRef.current?.click();
                                                            }}><MdAdd size={20}/> add friends</button>
                                                    </div>
                                                )
                                            )
                                        } 
                                    </div>
                                )
                            }
                            {
                                dataCategory == "requests" && (
                                    <div
                                        className="tab-pane d-flex flex-column justify-content-start align-items-center w-100"
                                        id="requests"
                                        role="tabpanel"
                                        aria-labelledby="requests-tab"
                                        style={{
                                            minHeight:"90vh",
                                            overflowY:"scroll"
                                        }}
                                    >
                                        {
                                            isLoading ? (
                                                <span className="loader"></span>
                                            ):(
                                                props.friendRequests && props.friendRequests.length !== 0 ?(
                                                    props.friendRequests.map((item,index)=>{
                                                        return(
                                                            <div 
                                                                ref={(el)=>userRequestRefs.current.push(el)}
                                                                key={index} 
                                                                title={item.email} 
                                                                className={`requests-preview ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}
                                                                style={{
                                                                    backgroundColor:theme.isDark || JSON.parse(localStorage.getItem("isDark"))?"#2E236C":"#7FA1C3",
                                                                }}
                                                                id={item.id}
                                                            >
                                                                <img src={item.senderAvatar} width={100} height={100} style={{border:`2px solid ${item.isLoggedIn?"green":"red"}`,borderRadius:"10px"}} alt="" />
                                                                <h3>{item.requestSender}</h3>
                                                                <small>10 mutual friends</small>
                                                                {
                                                                    item.isMine ?(
                                                                        <>
                                                                            <p className={`${(theme.isDark||JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>waiting for response</p>
                                                                            <button className="btn btn-danger">click to cancel</button>
                                                                        </>
                                                                    ):(
                                                                        <>
                                                                            <button className="btn btn-primary" onClick={async()=>{
                                                                                try {
                                                                                    let request = await fetchData("/user/requests-toggle","PUT",{id:item.id,approve:true},"json",setIsLoading);
                                                                                    if(jwtDecode(request.token).message_success){
                                                                                        console.log(userRequestRefs.current[index]);
                                                                                        userRequestRefs.current[index]?.remove();
                                                                                        setMessage(jwtDecode(request.token).message_success);
                                                                                        setTimeout(()=>{
                                                                                            setIsToastShown(false);
                                                                                            setMessage("");
                                                                                        },1000)
                                                                                    }
                                                                                } catch (error) {
                                                                                    console.log(error);
                                                                                }
                                                                            }}>Accept</button>
                                                                            <button className="btn btn-danger" onClick={async()=>{
                                                                                try {
                                                                                    let request = await fetchData("/user/requests-toggle","PUT",{id:item.id,approve:false},"json",setIsLoading);
                                                                                    if(jwtDecode(request.token).message_failure){
                                                                                        console.log(userRequestRefs.current[index]);
                                                                                        userRequestRefs.current[index]?.remove();
                                                                                        setError(jwtDecode(request.token).message_failure);
                                                                                        setTimeout(()=>{
                                                                                            setIsToastShown(false);
                                                                                            setError("");
                                                                                        },1000)
                                                                                    }
                                                                                } catch (error) {
                                                                                    console.log(error);
                                                                                }
                                                                            }}>deny</button>
                                                                        </>
                                                                    )
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                ):(
                                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                                        <h3 className={`text-center ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>No requests found</h3>
                                                        <NoDataFoundIcon/>
                                                        <button className="btn btn-primary" 
                                                            onClick={()=>{
                                                                setUserName("");
                                                                setDataCategory("search");
                                                                userSearchTabRef.current?.click();
                                                            }}><MdAdd size={20}/> Add friends</button>
                                                    
                                                    </div>
                                                )
                                            )
                                        } 
                                    </div>
                                )
                            }
                            {
                                dataCategory == "search" && (
                                    <div
                                        className="tab-pane d-flex flex-column justify-content-start align-items-center w-100"
                                        id="requests"
                                        role="tabpanel"
                                        aria-labelledby="requests-tab"
                                        style={{
                                            minHeight:"90vh",
                                            overflowY:"scroll"
                                        }}
                                    >
                                        <div className="w-100 d-flex flex-row justify-content-center align-items-center">
                                            <input 
                                                type="search" 
                                                name="" 
                                                id="" 
                                                className="form-control m-1" 
                                                onChange={(e)=>{
                                                    setUserName(e.target.value);
                                                }}
                                            />
                                            <button className={`btn btn-primary ${userName.length == 0 && "disabled"}`}
                                                disabled={userName.length == 0}
                                                onClick={async()=>{
                                                    try {
                                                        let request = await fetchData(`/user/search-friends?name=${userName}`,"GET",null,"json",setIsLoading);
                                                        let response = jwtDecode(request.token).items;
                                                        console.log(response);
                                                        setFoundUsers(response);
                                                    } catch (error) {
                                                        console.log(error);
                                                    }
                                                }}><FaSearch/></button>
                                        </div>
                                        {
                                            isLoading ? (
                                                <span className="loader"></span>
                                            ):(
                                                foundUsers && foundUsers.length !== 0 ?(
                                                    foundUsers && foundUsers.map((item,index)=>{
                                                        return(
                                                            <div 
                                                                key={index} 
                                                                title={item.email} 
                                                                className={`user-preview ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}
                                                                style={{
                                                                    backgroundColor:theme.isDark || JSON.parse(localStorage.getItem("isDark"))?"#2E236C":"#7FA1C3",
                                                                }}
                                                                id={item.id}
                                                            >
                                                                <img src={item.friendAvatar} width={100} height={100} style={{border:`2px solid ${item.isLoggedIn?"green":"red"}`,borderRadius:"10px"}} alt="" />
                                                                <h3>{item.name}</h3>
                                                                {
                                                                    !item.isMe ? (
                                                                        item.isMyFriend ? (
                                                                            <>
                                                                                <small>{item.similarFriendsCount !== 0?`${item.similarFriendsCount} similar friends`:"no similar friends"}</small>
                                                                                {
                                                                                    item.isBlocked && (
                                                                                        <button className="btn btn-danger"><MdBlock/> block</button>
                                                                                    )
                                                                                }
                                                                                <button className="btn btn-danger" onClick={async()=>{
                                                                                    try {
                                                                                        let request = await fetchData("/user/toggle-add-friend","POST",{
                                                                                            id:item.id
                                                                                        },"json",setIsLoading);
                                                                                        let response = jwtDecode(request.token);
                                                                                        console.log(response);
                                                                                    } catch (error) {
                                                                                        console.log(error);
                                                                                    }
                                                                                }}><MdRemove/> remove</button>
                                                                            </>
                                                                        ):(
                                                                            <>
                                                                                <small>{item.similarFriendsCount !== 0?`${item.similarFriendsCount} similar friends`:"no similar friends"}</small>
                                                                                <button className={`btn btn-primary ${item.requestObject?"bg-light text-primary":""}`} onClick={async()=>{
                                                                                    try {
                                                                                        let request = await fetchData("/user/toggle-add-friend","POST",{
                                                                                            id:item.id
                                                                                        },"json",setIsLoading);
                                                                                        let response = jwtDecode(request.token);
                                                                                        console.log(response);
                                                                                    } catch (error) {
                                                                                        console.log(error);
                                                                                    }
                                                                                }}>
                                                                                    {
                                                                                        item.requestObject?(
                                                                                            <>
                                                                                                <IoMdTime /> request sent click to cancel
                                                                                            </>
                                                                                        ):(
                                                                                            <>
                                                                                                <MdAdd/> add friend
                                                                                            </>
                                                                                        )
                                                                                    }
                                                                                </button>
                                                                            </>
                                                                        )
                                                                    ):(
                                                                        <>
                                                                            <button className="btn btn-primary"><RiProfileLine size={20}/> check profile</button>
                                                                        </>
                                                                    )
                                                                }
                                                                {
                                                                    item.isBlocked && (
                                                                        <button className="btn btn-danger"><MdBlock/> block</button>
                                                                    )
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                ):(
                                                    <div className="d-flex flex-column justify-content-center align-items-center">
                                                        <h3 className={`text-center ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>No users found</h3>
                                                        <NoDataFoundIcon/>
                                                        <button className="btn btn-primary" onClick={()=>{
                                                            setUserName("");
                                                            userSearchTabRef.current?.click();
                                                        }}><FaSearch/>try again</button>
                                                    </div>
                                                )
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </section>
                )  
            }
            {
                componentName == "groups" && (
                    <section className="messages">
                        <ul className="nav nav-tabs w-100 d-flex flex-row justify-content-center align-items-center" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link active"
                                    id="joined-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#joined"
                                    type="button"
                                    role="tab"
                                    aria-controls="joined"
                                    aria-selected="true"
                                    onClick={async()=>{
                                        setGroupCategory("joined");
                                        try {
                                            let request = await fetchData("/groups/joined","GET",null,"json",setIsLoading);
                                            let response = jwtDecode(request.token).joinedGroups
                                            props.setGroups(response);
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }}
                                >
                                    <FaInfoCircle size={20}/> Details
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link"
                                    id="search-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#search"
                                    type="search"
                                    role="tab"
                                    aria-controls="search"
                                    aria-selected="false"
                                    ref={groupSearchTabRef}
                                    onClick={()=>{setGroupCategory("search");}}
                                >
                                    <MdSearch size={20}/> search
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link"
                                    id="create-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#create"
                                    type="create"
                                    role="tab"
                                    aria-controls="create"
                                    aria-selected="false"
                                    ref={groupSearchTabRef}
                                    onClick={()=>{setGroupCategory("create");}}
                                >
                                    <MdCreate size={20}/> create
                                </button>
                            </li>
                        </ul>
                        <div className="w-100 tab-content">
                            {
                                groupCategory == "joined" && (
                                    <div 
                                        className="tab-pane d-flex flex-column justify-content-start align-items-center w-100"
                                        id="requests"
                                        role="tabpanel"
                                        aria-labelledby="requests-tab"
                                        style={{
                                            minHeight:"90vh",
                                            overflowY:"scroll"
                                        }}
                                    >
                                        <div className="accordion w-100" id="accordionExample">
                                            <div 
                                                className="accordion-item"
                                                style={{
                                                    backgroundColor:(theme.isDark||JSON.parse(localStorage.getItem("isDark")))?"rgba(0,0,70,.8)":"rgba(255,255,255,.5)"
                                                }}>
                                                <h2 className="accordion-header" id="headingOne">
                                                    <button
                                                        className="accordion-button"
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target="#my-groups"
                                                        aria-expanded="true"
                                                        aria-controls="my-groups"
                                                        style={{
                                                            color:(theme.isDark||JSON.parse(localStorage.getItem("isDark")))?"rgba(255,255,255,.8)":"rgba(0,0,0,.8)",
                                                            backgroundColor:(theme.isDark||JSON.parse(localStorage.getItem("isDark")))?"rgba(0,0,60,.8)":"rgba(255,255,255,.8)",
                                                        }}
                                                        onClick={async()=>{
                                                            try {
                                                                let request = await fetchData("/groups/joined","GET",null,"json",setIsLoading);
                                                                let response = jwtDecode(request.token).joinedGroups
                                                                props.setGroups(response);
                                                                console.log(props.groups);
                                                            } catch (error) {
                                                                console.log(error);
                                                            }
                                                        }}
                                                    >
                                                        <h6>joined</h6>
                                                    </button>
                                                </h2>
                                                <div
                                                    id="my-groups"
                                                    className="accordion-collapse collapse show"
                                                    aria-labelledby="headingOne"
                                                    data-bs-parent="#accordionExample"
                                                    style={{
                                                        backgroundColor:(theme.isDark||JSON.parse(localStorage.getItem("isDark")))?"rgba(0,0,70,.8)":"rgba(255,255,255,.5)"
                                                    }}
                                                >
                                                    <div className="accordion-body">
                                                    {
                                                        isLoading ? (
                                                            <span className="loader"></span>
                                                        ):(
                                                            props.groups && props.groups.length !== 0 ?(
                                                                props.groups.map((item,index)=>{
                                                                    return(
                                                                        <div key={index} title={item.email} className={`message-preview ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>
                                                                            <img src={item.groupAvatar} width={50} height={50} style={{border:`2px solid ${item.isLoggedIn?"green":"red"}`,borderRadius:"10px"}} alt="" />
                                                                            <h4>{item.groupName}</h4>
                                                                            {item.unseenMessagesCount !== 0 && (
                                                                                <span>{item.unseenMessagesCount}</span>
                                                                            )}
                                                                            <p>
                                                                                {item.messageIsMine?<strong>Me :</strong>:item.name}
                                                                                {
                                                                                    item.lastMessage && item.lastMessage.length !== 0 ? item.lastMessage.slice(0,10)+"...":
                                                                                    item.files && item.files!==0 && (
                                                                                        <span>{item.files} <FaFile/></span>
                                                                                    )
                                                                                }</p>
                                                                        </div>
                                                                    )
                                                                })
                                                            ):(
                                                                <div className="d-flex flex-column justify-content-start align-items-center">
                                                                    <h3 className={`text-center ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>You are not joined in any group</h3>
                                                                    <NoDataFoundIcon/>
                                                                    <button className="btn btn-primary" 
                                                                        onClick={()=>{
                                                                        groupSearchTabRef.current?.click();
                                                                    }}><MdSearch size={20}/> Search for groups</button>
                                                                </div>
                                                            )
                                                        )
                                                    }
                                                    </div>
                                                </div>
                                                <h2 
                                                    className="accordion-header" 
                                                    id="headingOne">
                                                    <button
                                                        className="accordion-button"
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target="#requests"
                                                        aria-expanded="true"
                                                        aria-controls="requests"
                                                        style={{
                                                            color:(theme.isDark||JSON.parse(localStorage.getItem("isDark")))?"rgba(255,255,255,.8)":"rgba(0,0,0,.8)",
                                                            backgroundColor:(theme.isDark||JSON.parse(localStorage.getItem("isDark")))?"rgba(0,0,60,.8)":"rgba(255,255,255,.8)",
                                                        }}
                                                        onClick={async()=>{
                                                            try {
                                                                let request = await fetchData("/groups/requests","GET",null,"json",setIsLoading);
                                                                let response = jwtDecode(request.token).items
                                                                console.log(groupRequests);
                                                                setGroupRequests(response);
                                                            } catch (error) {
                                                                console.log(error);
                                                            }
                                                        }}
                                                    >
                                                        <h6>Requests</h6>
                                                    </button>
                                                </h2>
                                                <div
                                                    id="requests"
                                                    className="accordion-collapse collapse show"
                                                    aria-labelledby="headingOne"
                                                    data-bs-parent="#accordionExample"
                                                >
                                                    <div className="accordion-body d-flex flex-column justify-content-start align-items-center">
                                                        {
                                                            isLoading ? (
                                                                <span className="loader"></span>
                                                            ):(
                                                                groupRequests && groupRequests.length !== 0 ? (
                                                                    groupRequests.map((item,index)=>{
                                                                        return(
                                                                            <div key={index} title={item.email} className={`group-preview ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>
                                                                                <div className="w-100 d-flex flex-column justify-content-start align-items-center">
                                                                                    <img src={item.groupAvatar} width={100} height={100} style={{borderRadius:"10px"}} alt="" />
                                                                                    <h4>{item.groupName}</h4>
                                                                                </div>
                                                                                <div className="w-100 d-flex flex-column justify-content-start align-items-center gap-1">
                                                                                    <img src={item.requestSenderAvatar} width={80} height={80} style={{border:`2px solid ${item.userIsLoggedIn?"green":"red"}`,borderRadius:"10px"}} alt="" />
                                                                                    <strong>{item.requestSender}</strong>
                                                                                    <div className="d-flex flex-row justify-content-center align-items-center gap-1">
                                                                                        <button className="btn btn-primary"><MdPreview size={10}/> <span style={{fontSize:"15px"}}>preview</span></button>
                                                                                        <button className="btn btn-success"
                                                                                            onClick={async()=>{
                                                                                                try {
                                                                                                    let request = await fetchData("/groups/toggle-accept-user","POST",{
                                                                                                        approve:true,id:item.id,userId:item.userId   
                                                                                                    },"json",setIsLoading);
                                                                                                    let response = jwtDecode(request.token);
                                                                                                    if(response.message){
                                                                                                        setMessage(response.message);
                                                                                                    }else if(response.error){
                                                                                                        setError(response.error);
                                                                                                    }
                                                                                                    setIsToastShown(true);
                                                                                                    setTimeout(()=>{
                                                                                                        setIsToastShown(false)
                                                                                                    },1000);
                                                                                                } catch (error) {
                                                                                                    console.log(error);
                                                                                                }
                                                                                            }}
                                                                                        ><MdAdd size={10}/> <span style={{fontSize:"15px"}}>accept</span></button>
                                                                                        <button className="btn btn-danger"
                                                                                            onClick={async()=>{
                                                                                                try {
                                                                                                    let request = await fetchData("/groups/toggle-accept-user","POST",{
                                                                                                        approve:false,id:item.id,userId:item.userId   
                                                                                                    },"json",setIsLoading);
                                                                                                    let response = jwtDecode(request.token);
                                                                                                    if(response.message){
                                                                                                        setMessage(response.message);
                                                                                                    }else if(response.error){
                                                                                                        setError(response.error);
                                                                                                    }
                                                                                                    setIsToastShown(true);
                                                                                                    setTimeout(()=>{
                                                                                                        setIsToastShown(false)
                                                                                                    },1000);
                                                                                                } catch (error) {
                                                                                                    console.log(error);
                                                                                                }
                                                                                            }}
                                                                                        ><MdRemove size={10}/> <span style={{fontSize:"15px"}}>Reject</span></button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })
                                                                ):(
                                                                    <div className="d-flex flex-column justify-content-start align-items-center">
                                                                        <h3 className={`text-center ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>You are not joined in any group</h3>
                                                                        <NoDataFoundIcon/>
                                                                        <button className="btn btn-primary" 
                                                                            onClick={()=>{
                                                                            groupSearchTabRef.current?.click();
                                                                        }}><MdSearch size={20}/> Search for groups</button>
                                                                    </div>
                                                                )
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <h2 
                                                    className="accordion-header" 
                                                    id="headingOne">
                                                    <button
                                                        className="accordion-button"
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target="#administrated"
                                                        aria-expanded="true"
                                                        aria-controls="administrated"
                                                        style={{
                                                            color:(theme.isDark||JSON.parse(localStorage.getItem("isDark")))?"rgba(255,255,255,.8)":"rgba(0,0,0,.8)",
                                                            backgroundColor:(theme.isDark||JSON.parse(localStorage.getItem("isDark")))?"rgba(0,0,60,.8)":"rgba(255,255,255,.8)",
                                                        }}
                                                        onClick={async()=>{
                                                            try {
                                                                let request = await fetchData("/groups/joined","GET",null,"json",setIsLoading);
                                                                let response = jwtDecode(request.token).joinedGroups
                                                                props.setGroups(response);
                                                                console.log(props.groups);
                                                            } catch (error) {
                                                                console.log(error);
                                                            }
                                                        }}
                                                    >
                                                        <h6>My groups</h6>
                                                    </button>
                                                </h2>
                                                <div
                                                    id="administrated"
                                                    className="accordion-collapse collapse show"
                                                    aria-labelledby="headingOne"
                                                    data-bs-parent="#accordionExample"
                                                >
                                                    <div className="accordion-body d-flex flex-column justify-content-start align-items-center">
                                                        {
                                                            isLoading ? (
                                                                <span className="loader"></span>
                                                            ):(
                                                                props.groups && props.groups.length !== 0 ?(
                                                                    props.groups.map((item,index)=>{
                                                                        return(
                                                                            <div key={index} title={item.email} className={`message-preview ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>
                                                                                <img src={item.groupAvatar} width={50} height={50} style={{border:`2px solid ${item.isLoggedIn?"green":"red"}`,borderRadius:"10px"}} alt="" />
                                                                                <h4>{item.groupName}</h4>
                                                                                {item.unseenMessagesCount !== 0 && (
                                                                                    <span>{item.unseenMessagesCount}</span>
                                                                                )}
                                                                                <p>
                                                                                    {item.messageIsMine?<strong>Me :</strong>:item.name}
                                                                                    {
                                                                                        item.lastMessage && item.lastMessage.length !== 0 ? item.lastMessage.slice(0,10)+"...":
                                                                                        item.files && item.files!==0 && (
                                                                                            <span>{item.files} <FaFile/></span>
                                                                                        )
                                                                                    }</p>
                                                                            </div>
                                                                        )
                                                                    })
                                                                ):(
                                                                    <div className="d-flex flex-column justify-content-start align-items-center">
                                                                        <h3 className={`text-center ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>You are not joined in any group</h3>
                                                                        <NoDataFoundIcon/>
                                                                        <button className="btn btn-primary" 
                                                                            onClick={()=>{
                                                                            groupSearchTabRef.current?.click();
                                                                        }}><MdSearch size={20}/> Search for groups</button>
                                                                    </div>
                                                                )
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                )
                            }
                            {
                                groupCategory == "search" && (
                                    <div 
                                        className="tab-pane d-flex flex-column justify-content-start align-items-center w-100"
                                        id="requests"
                                        role="tabpanel"
                                        aria-labelledby="requests-tab"
                                        style={{
                                            minHeight:"90vh",
                                            overflowY:"scroll"
                                        }}
                                    >
                                        <div className="w-100 d-flex flex-row justify-content-center align-items-center">
                                            <input 
                                                type="search" 
                                                name="" 
                                                id="" 
                                                className="form-control m-1" 
                                                onChange={(e)=>setGroupName(e.target.value)}
                                            />
                                            <button className={`btn btn-primary ${groupName.length == 0 && "disabled"}`}
                                                disabled={groupName.length == 0}
                                                onClick={async()=>{
                                                    try {
                                                        let request = await fetchData(`/groups/search?name=${groupName}`,"GET",null,"json",setIsLoading);
                                                        let response = jwtDecode(request.token);
                                                        setFoundGroups(response.foundGroups);
                                                        console.log(foundGroups);
                                                    } catch (error) {
                                                        console.log(error);
                                                    }
                                                }}><FaSearch/></button>
                                        </div>
                                        {
                                            isLoading ?(
                                                <span className="loader"></span>
                                            ):(
                                                foundGroups.length && foundGroups.length !== 0 ?(
                                                    foundGroups.map((item,index)=>{
                                                        return(
                                                            <div 
                                                                key={index} 
                                                                className={`group-preview ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}
                                                                style={{
                                                                    backgroundColor:(theme.isDark||JSON.parse(localStorage.getItem("isDark")))?"rgba(255,255,255,.25)":"rgba(0,0,0,.25)",
                                                                    borderColor:`${(theme.isDark||JSON.parse(localStorage.getItem("isDark")))?"rgba(255,255,255,.75)":"rgba(0,0,0,.75)"}`,
                                                                    backdropFilter:"blur(10px)",
                                                                    borderWidth:"2px 2px 0px 0px",
                                                                    borderStyle:"solid",
                                                                    cursor:"pointer"
                                                                }}
                                                            >
                                                                <img src={item.groupAvatar} width={100} height={100} alt={item.usersCount} style={{borderRadius:"10px"}}/>
                                                                <h3>{item.groupName}</h3>
                                                                <p>{item.usersCount} users in this group</p>
                                                                {item.isPrivate?(
                                                                    <p>
                                                                        <CiLock size={30}/>
                                                                        <span>private group</span>
                                                                    </p>
                                                                    ):(
                                                                    <p>
                                                                        <CiUnlock size={30}/>
                                                                        <span>public group</span>
                                                                    </p>
                                                                )}
                                                                {
                                                                    item.IamJoined ?(
                                                                        <>
                                                                        {
                                                                            item.isMyGroup && (
                                                                                <button className="btn btn-primary"><MdEdit/> edit group</button>
                                                                            )
                                                                        }
                                                                            <button 
                                                                                className="btn btn-danger" 
                                                                                onClick={async(e)=>{
                                                                                    try {
                                                                                        let request = await fetchData("/groups/leave-group","PUT",{
                                                                                            id:item.id
                                                                                        },"json",setIsLoading);
                                                                                        let response = jwtDecode(request.token);
                                                                                        if(response.message){
                                                                                            setMessage(response.message);
                                                                                        }else if(response.error){
                                                                                            setError(response.error);
                                                                                        }
                                                                                        setIsToastShown(true);
                                                                                        setTimeout(()=>{
                                                                                            setIsToastShown(false);
                                                                                            e.target.parentElement.remove();
                                                                                        },1000);
                                                                                    } catch (error) {
                                                                                        console.log(error);
                                                                                    }
                                                                                }}>
                                                                            <IoMdExit size={20}/> leave</button>
                                                                        </>
                                                                    ):(
                                                                        <>
                                                                            {
                                                                                !item.isPending && (
                                                                                    <button className="btn btn-primary" onClick={async()=>{
                                                                                        try {
                                                                                            let request = await fetchData("/groups/toggle-join-group","POST",{
                                                                                                id:item.id
                                                                                            },"json",setIsLoading);
                                                                                            let response = jwtDecode(request.token);
                                                                                            if(response.message){
                                                                                                setMessage(response.message);
                                                                                            }else if(response.error){
                                                                                                setError(response.error);
                                                                                            }
                                                                                            setIsToastShown(true);
                                                                                            setTimeout(()=>{
                                                                                                setIsToastShown(false);
                                                                                            },1000);
                                                                                        } catch (error) {
                                                                                            console.log(error);
                                                                                        }
                                                                                    }}><MdAdd/> join group</button>
                                                                                )
                                                                            }
                                                                        </>
                                                                    )
                                                                }
                                                                {
                                                                    item.isPending && (
                                                                        <button className="btn btn-warning" onClick={async()=>{
                                                                            try {
                                                                                let request = await fetchData(`/groups/cancel-request/${item.id}`,"DELETE",null,"json",setIsLoading);
                                                                                let response = jwtDecode(request.token);
                                                                                console.log(response);
                                                                                if(response.message){
                                                                                    setMessage(response.message)
                                                                                }else if(response.error){
                                                                                    setError(response.error)
                                                                                }
                                                                                setIsToastShown(true);
                                                                                setTimeout(()=>{
                                                                                    setIsToastShown(false);
                                                                                },1000)
                                                                            } catch (error) {
                                                                                console.log(error);
                                                                            }
                                                                        }}><MdCancel/> cancel request</button>
                                                                    )
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                ):(
                                                    <div className="d-flex flex-column justify-content-start align-items-center">
                                                        <h3 className={`text-center ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>No groups are matching your search</h3>
                                                        <NoDataFoundIcon/>
                                                        <button  
                                                            className="btn btn-primary" 
                                                            onClick={()=>{
                                                                setGroupCategory("");
                                                                groupSearchTabRef.current?.click();
                                                            }}><CiRepeat size={20}/> try again</button>
                                                    </div>
                                                )
                                            )
                                        }
                                    </div>
                                )
                            }
                            {
                                groupCategory == "create" && (
                                    <div 
                                        className="tab-pane d-flex flex-column justify-content-start align-items-center w-100"
                                        id="create"
                                        role="tabpanel"
                                        aria-labelledby="create-tab"
                                        style={{
                                            minHeight:"90vh",
                                            overflowY:"scroll"
                                        }}
                                    >
                                        <div className="w-100 d-flex flex-column justify-content-start align-items-center gap-2">
                                            <input type="text" className="form-control" onChange={(e)=>setGroupNameToCreate(e.target.value)} value={groupNameToCreate}/>
                                            <div className="d-flex flex-row justify-content-start align-items-center gap-2">
                                                <button className="btn btn-outline-primary border-2 text-light" onClick={()=>setIsGroupPrivate(val=>!val)}>
                                                    {
                                                        isGroupPrivate?(
                                                            <CiUnlock size={30} strokeWidth={1.5}/>
                                                        ):(
                                                            <CiLock size={30} strokeWidth={1.5}/>
                                                        )
                                                    }
                                                </button>
                                                <label htmlFor="private-item" className={`${(theme.isDark || JSON.parse(localStorage.getItem("idDark")))?"text-light":"text-dark"}`}>{isGroupPrivate?"public":"private"} group</label>
                                            </div>
                                            <div 
                                                className="d-flex flex-row justify-content-start align-items-center gap-2" 
                                                style={{
                                                    width:"150px",
                                                    height:"150px",
                                                    position:"relative",
                                                    borderRadius:"5px",
                                                    backgroundColor:`${(theme.isDark|| JSON.parse(localStorage.getItem("isDark")))?"rgba(100, 21, 59, 0.5)":"rgba(229, 150, 218, 0.5)"}`,
                                                    border:`2px dashed ${(theme.isDark|| JSON.parse(localStorage.getItem("isDark")))?"rgba(255, 255, 255, 0.5)":"rgba(0, 0, 0, 0.5)"}`
                                                }}
                                                >
                                                <input type="file" name="" id="" className="form-control opacity-0 w-100 h-100" onChange={async(e)=>{
                                                    try {
                                                        let imageURL = await fileReading(e.target.files[0]);
                                                        setAvatar(imageURL);
                                                    } catch (error) {
                                                        console.log(error);
                                                    }
                                                }}/>
                                                <MdUpload 
                                                    size={150} 
                                                    color={(theme.isDark || JSON.parse(localStorage.getItem("idDark")))?"white":"black"}
                                                    style={{position:"absolute",top:0,left:0,pointerEvents:"none"}}
                                                />
                                            </div>
                                            {
                                                avatar && avatar.length > 0 && (
                                                    <img src={avatar} alt="group avatar" height={150} style={{borderRadius:20,width:"auto"}}/>
                                                )
                                            }
                                            <button 
                                                className="btn btn-primary" 
                                                disabled={(groupNameToCreate.length == 0 && avatar.length == 0)}
                                                onClick={async()=>{
                                                    try {
                                                        let request = await fetchData("/groups/create","POST",{
                                                            name:groupNameToCreate,
                                                            isPrivate:isGroupPrivate,
                                                            avatar
                                                        },"json",setIsLoading)
                                                        let response = jwtDecode(request.token);
                                                        if(response.message){
                                                            setMessage(response.message);
                                                            setIsToastShown(true);
                                                        }else if(response.error){
                                                            setError(response.error)
                                                            setIsToastShown(true);
                                                        }
                                                        setTimeout(()=>{
                                                            setIsToastShown(false);
                                                        },1000);
                                                    } catch (error) {
                                                        console.log(error);
                                                    }
                                                }}
                                            >
                                            <MdCreate size={20}/> create</button>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </section>
                )  
            }
            {
                componentName == "notifications" && (
                    isLoading ? (
                        <span className="loader"></span>
                    ):(
                        props.notifications.length !== 0 ?(
                            props.notifications.map((item,index)=>{
                                return(
                                    <div 
                                        key={index} 
                                        title={item.email} 
                                        className={`message-preview ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>
                                        <img src={item.notificationHandlerAvatar} width={50} height={50} 
                                            style={{border:`2px solid ${item.isLoggedIn?"green":"red"}`,borderRadius:"10px"}} 
                                            alt="" />
                                        <p>{item.content}</p>
                                    </div>
                                )
                            })
                        ):(
                            <div>
                                <p className={`text-center ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>There are no notifications</p>
                                <NoDataFoundIcon/>
                            </div>
                        )
                    )
                )
            }
            {
                isPopupShown  && (
                    <Popup isPopupShown={isPopupShown} setIsPopupShown={setIsPopupShown}/>
                )
            }
            {
                toastShown &&  message && message.length!==0 && (
                    <Toast isShown={true} message={message}/>
                )
            }
            {
                toastShown && error && error.length!==0 &&(
                    <Toast isShown={true} error={error}/>
                )
            }
        </aside>
    )
}
