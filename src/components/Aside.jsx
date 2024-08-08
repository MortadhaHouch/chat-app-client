/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { IoIosArrowForward,IoIosArrowBack } from "react-icons/io";
import { MdGroups } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { fetchData } from "../../utils/fetchData";
import { jwtDecode } from "jwt-decode";
import { FaFile } from "react-icons/fa";
import { ThemeContext } from "../../providers/ThemeContextProvider";
import Popup from "./Popup";
export default function Aside(props) {
    let [isShown,setIsShown] = useState(false);
    let [isPopupShown,setIsPopupShown] = useState(false);
    let [componentName,setComponentName] = useState("friends");
    let [isLoading,setIsLoading] = useState(false);
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
                left:"100%"
            }} onClick={()=>setIsShown(val=>!val)}>{isShown?<IoIosArrowForward />:<IoIosArrowBack />}</button>
            <div className="w-100 d-flex flex-row justify-content-center align-items-center">
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
            </div>
            {
                componentName == "friends" &&(
                    props.friends && props.friends.length !==0 ?(
                        <section className="messages">
                            {
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
                            }
                        </section>
                    ):(
                        <p>there no friends</p>
                    )
                )  
            }
            {
                componentName == "groups" && (
                    props.groups && props.groups.length !==0 ?(
                        <section className="messages">
                            {
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
                            }
                        </section>
                    ):(
                        <p>there no friends</p>
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
