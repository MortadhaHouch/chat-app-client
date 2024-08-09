/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { IoIosArrowForward,IoIosArrowBack } from "react-icons/io";
import { MdAdd, MdBlock, MdGroups, MdOutlineRequestPage, MdRemove, MdRequestQuote } from "react-icons/md";
import { FaSearch, FaTimes, FaUser } from "react-icons/fa";
import { fetchData } from "../../utils/fetchData";
import { jwtDecode } from "jwt-decode";
import { FaFile } from "react-icons/fa";
import { ThemeContext } from "../../providers/ThemeContextProvider";
import Popup from "./Popup";
import { IoMdTime } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import NoDataFoundIcon from "../icons/NoDataFoundIcon";
export default function Aside(props) {
    let [isShown,setIsShown] = useState(false);
    let [isPopupShown,setIsPopupShown] = useState(false);
    let [componentName,setComponentName] = useState("friends");
    let [dataCategory,setDataCategory] = useState("users");
    let [isLoading,setIsLoading] = useState(false);
    let [foundUsers,setFoundUsers] = useState([]);
    let [name,setName] = useState("");
    let theme = useContext(ThemeContext);
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
                ><FaUser/><span>friends</span></button>
                <button className={`btn ${componentName == "groups"?"btn-info":"btn-secondary"} w-50 d-flex flex-column justify-content-center align-items-center`}
                    onClick={async()=>{
                        setComponentName("groups");
                        try {
                            let request = await fetchData("/user/groups","GET",null,"json",setIsLoading);
                            props.setGroups(jwtDecode(request.token).groups);
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                ><MdGroups/><span>groups</span></button>
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
                ><IoIosNotifications /><span>notifications</span></button>
            </div>
            {
                componentName == "friends" &&(
                    props.friends && props.friends.length !==0 ?(
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
                                        }}
                                    >
                                        <FaUser/> friends
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
                                        <MdAdd/> requests
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
                                        onClick={async()=>{
                                            setDataCategory("search");
                                        }}
                                    >
                                        <FaSearch/> search
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
                                                    props.friends.map((item,index)=>{
                                                        return(
                                                            <div 
                                                                key={index} 
                                                                title={item.email} 
                                                                className={`message-preview ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"} ${props.discussion.id==item.id?"active":""}`}
                                                                style={{
                                                                    backgroundColor:props.discussion.id==item.id?(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"#1F316F":"#7FA1C3":(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"#17153B":"#E5E1DA",
                                                                    borderRadius:"10px 0px 0px 10px"
                                                                }}
                                                                id={item.id}
                                                                onClick={()=>{
                                                                    props.setDiscussion(item);
                                                                    if(props.discussion.id==item.id){
                                                                        setIsPopupShown(true);
                                                                    }
                                                                }}
                                                            >
                                                                <img src={item.friendAvatar} width={50} height={50} style={{border:`2px solid ${item.isLoggedIn?"green":"red"}`,borderRadius:"10px"}} alt="" />
                                                                <strong>{item.userName}</strong>
                                                                <span>{item.unseenMessagesCount}</span>
                                                                <p>
                                                                    {item.messageIsMine?<strong>Me :</strong>:item.name}
                                                                    {
                                                                        item.lastMessage.length !== 0 ? item.lastMessage.slice(0,10)+"...":
                                                                        item.files && item.files!==0 && (
                                                                            <span>{item.files} <FaFile/></span>
                                                                        )
                                                                    }</p>
                                                            </div>
                                                        )
                                                    })
                                                )
                                            } 
                                        </div>
                                    )
                                }
                                {
                                    dataCategory == "requests" && (
                                        <div
                                            className="tab-pane d-flex flex-column justify-content-center align-items-center w-100"
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
                                                    props.friendRequests.map((item,index)=>{
                                                        return(
                                                            <div 
                                                                key={index} 
                                                                title={item.email} 
                                                                className={`requests-preview ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"} ${props.discussion.id==item.id?"active":""}`}
                                                                style={{
                                                                    backgroundColor:theme.isDark || JSON.parse(localStorage.getItem("isDark"))?"#2E236C":"#7FA1C3",
                                                                }}
                                                                id={item.id}
                                                            >
                                                                <img src={item.senderAvatar} width={100} height={100} style={{border:`2px solid ${item.isLoggedIn?"green":"red"}`,borderRadius:"10px"}} alt="" />
                                                                <h3>{item.requestSender}</h3>
                                                                <small>10 mutual friends</small>
                                                                <button className="btn btn-primary" onClick={async()=>{
                                                                    try {
                                                                        let request = await fetchData("/user/requests-toggle","PUT",{id:item.id,approve:true},"json",setIsLoading);
                                                                        console.log(jwtDecode(request.token).message_success);
                                                                        
                                                                    } catch (error) {
                                                                        console.log(error);
                                                                    }
                                                                }}>Accept</button>
                                                                <button className="btn btn-danger" onClick={async()=>{
                                                                    try {
                                                                        let request = await fetchData("/user/requests-toggle","PUT",{id:item.id,approve:false},"json",setIsLoading);
                                                                        console.log(jwtDecode(request.token).message_failure);
                                                                        
                                                                    } catch (error) {
                                                                        console.log(error);
                                                                    }
                                                                }}>deny</button>
                                                            </div>
                                                        )
                                                    })
                                                )
                                            } 
                                        </div>
                                    )
                                }
                                {
                                    dataCategory == "search" && (
                                        <div
                                            className="tab-pane d-flex flex-column justify-content-center align-items-center w-100"
                                            id="search"
                                            role="tabpanel"
                                            aria-labelledby="search-tab"
                                            style={{padding:10}}
                                        >
                                            <div className="w-100 d-flex flex-row justify-content-center align-items-center">
                                                <input 
                                                    type="search" 
                                                    name="" 
                                                    id="" 
                                                    className="form-control m-1" 
                                                    onChange={(e)=>setName(e.target.value)}
                                                    value={name}
                                                />
                                                <button className={`btn btn-primary ${name.length == 0 && "disabled"}`}
                                                    disabled={name.length == 0}
                                                    onClick={async()=>{
                                                        try {
                                                            let request = await fetchData(`/user/search-friends?name=${name}`,"GET",null,"json",setIsLoading);
                                                            let response = jwtDecode(request.token);
                                                            setFoundUsers(response.items);
                                                        } catch (error) {
                                                            console.log(error);
                                                        }
                                                    }}><FaSearch/></button>
                                            </div>
                                            {
                                                isLoading ? (
                                                    <span className="loader"></span>
                                                ):(
                                                    foundUsers.map((item,index)=>{
                                                        return(
                                                            <div 
                                                                key={index} 
                                                                title={item.email} 
                                                                className={`user-preview ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"} ${props.discussion.id==item.id?"active":""}`}
                                                                style={{
                                                                    backgroundColor:theme.isDark || JSON.parse(localStorage.getItem("isDark"))?"#2E236C":"#7FA1C3",
                                                                }}
                                                                id={item.id}
                                                                onClick={()=>{
                                                                    props.setDiscussion(item);
                                                                    if(props.discussion.id==item.id){
                                                                        setIsPopupShown(true);
                                                                    }
                                                                }}
                                                            >
                                                                <img src={item.friendAvatar} width={100} height={100} style={{border:`2px solid ${item.isLoggedIn?"green":"red"}`,borderRadius:"10px"}} alt="" />
                                                                <h3>{item.name}</h3>
                                                                <small>10 mutual friends</small>
                                                                {
                                                                    item.isMyFriend ? (
                                                                        <>
                                                                            {
                                                                                item.isBlocked && (
                                                                                    <button className="btn btn-danger"><MdBlock/> block</button>
                                                                                )
                                                                            }
                                                                            <button className="btn btn-danger"><MdRemove/> remove</button>
                                                                        </>
                                                                    ):(
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
                                                )
                                            } 
                                        </div>
                                    )
                                }
                            </div>
                        </section>
                    ):(
                        <div>
                            <p className={`text-center ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>There are no friends in your friends list</p>
                            <NoDataFoundIcon/>
                        </div>
                    )
                )  
            }
            {
                componentName == "groups" && (
                    props.groups && props.groups.length !==0 ?(
                        <section className="messages">
                            {
                                isLoading ? (
                                    <span className="loader"></span>
                                ):(
                                    props.groups.map((item,index)=>{
                                        return(
                                            <div key={index} title={item.email} className={`message-preview ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>
                                                <img src={item.friendAvatar} width={50} height={50} style={{border:`2px solid ${item.isLoggedIn?"green":"red"}`,borderRadius:"10px"}} alt="" />
                                                <strong>{item.userName}</strong>
                                                <span>{item.unseenMessagesCount}</span>
                                                <p>
                                                    {item.messageIsMine?<strong>Me :</strong>:item.name}
                                                    {
                                                        item.lastMessage.length !== 0 ? item.lastMessage.slice(0,10)+"...":
                                                        item.files && item.files!==0 && (
                                                            <span>{item.files} <FaFile/></span>
                                                        )
                                                    }</p>
                                            </div>
                                        )
                                    })
                                )
                            }
                        </section>
                    ):(
                        <div>
                            <p className={`text-center ${(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"text-light":"text-dark"}`}>You are joined in any group</p>
                            <NoDataFoundIcon/>
                        </div>
                    )
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
        </aside>
    )
}
