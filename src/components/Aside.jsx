/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { IoIosArrowForward,IoIosArrowBack } from "react-icons/io";
import { MdGroups } from "react-icons/md";
import { FaUser } from "react-icons/fa";
export default function Aside(props) {
    let [isShown,setIsShown] = useState(false);
    let [componentName,setComponentName] = useState("users");
    return (
        <aside className={`aside left-aside ${isShown?"shown":"hidden"}`}>
            <button className="position-absolute btn btn-info d-flex flex-column justify-content-center align-items-center" style={{
                top:100,
                left:"100%"
            }} onClick={()=>setIsShown(val=>!val)}>{isShown?<IoIosArrowForward />:<IoIosArrowBack />}</button>
            <div className="w-100 d-flex flex-row justify-content-center align-items-center">
                <button className={`btn ${componentName == "friends"?"btn-info":"btn-secondary"} w-50 d-flex flex-column justify-content-center align-items-center`}
                    onClick={()=>setComponentName("friends")}
                ><FaUser/><span>friends</span></button>
                <button className={`btn ${componentName == "groups"?"btn-info":"btn-secondary"} w-50 d-flex flex-column justify-content-center align-items-center`}
                    onClick={()=>setComponentName("groups")}
                ><MdGroups/><span>groups</span></button>
            </div>
            {
                componentName == "friends" &&(
                    props.friends && props.friends.length !==0 ?(
                        <div>
                            {
                                
                            }
                        </div>
                    ):(
                        <p>there no friends</p>
                    )
                )  
            }
            {
                componentName == "groups" && (
                    props.groups && props.groups.length !==0 ?(
                        <div>
                            {
                                
                            }
                        </div>
                    ):(
                        <p>there no groups</p>
                    )
                )  
            }
        </aside>
    )
}
