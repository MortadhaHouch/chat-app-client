/* eslint-disable no-unused-vars */
import { useContext, useState } from "react"
import { FaBirthdayCake,FaMoon } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { fetchData } from "../../utils/fetchData";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import { IoSunny } from "react-icons/io5";
import {ThemeContext} from "../../providers/ThemeContextProvider"
export default function ProfilePanel() {
    let [isShown,setIsShown] = useState(false);
    let [isLoading,setIsLoading] = useState(false);
    let [cookies,setCookie,removeCookie] = useCookies("jwt_token");
    let theme = useContext(ThemeContext);
    return (
        <aside className={`right-aside ${isShown?"shown":"hidden"}`}>
            <button
                className="btn"
                style={{
                    position: "absolute",
                    top: "5%",
                    right: "100%",
                }}
                onClick={()=>setIsShown(val=>!val)}
            ><img src={localStorage.getItem("avatar")} style={{borderRadius:10}} alt="" width={60} height={60}/></button>
            <section className="d-flex flex-column justify-content-center align-items-center">
                <img 
                    src={localStorage.getItem("avatar")} 
                    alt="avatar"
                    width={100}
                    height={100}
                    style={{
                        borderRadius: "20%",
                        objectFit: "cover",
                        marginBottom: "20px",
                        border: "5px solid rgba(255, 255, 255, 0.2)"
                    }}
                />
                <h3>{localStorage.getItem("firstName")} {localStorage.getItem("lastName")}</h3>
                <h4>{localStorage.getItem("email")}</h4>
                <h4><FaBirthdayCake />{localStorage.getItem("date")}</h4>
            </section>
            <div className="d-flex flex-column justify-content-center align-items-center" style={{gap:10}}>
                <button className="btn" onClick={()=>{
                    theme.setIsDark((val)=>{
                        localStorage.setItem("isDark",!val);
                        return !val;
                    });
                }}>
                    {
                        theme.isDark || JSON.parse(localStorage.getItem("isDark"))?(
                            <IoSunny size={20}/>
                        ):(
                            <FaMoon size={20}/>
                        )
                    }
                </button>
                <button className="btn btn-primary w-100"><CiEdit /> <span>Edit profile</span></button>
                <button className="btn btn-danger w-100" onClick={async()=>{
                    try {
                        let request = await fetchData("/user/logout","POST",null,"json",setIsLoading);
                        if(jwtDecode(request.token).message){
                            localStorage.clear();
                            window.location.href = "/";
                            removeCookie("jwt_token",{
                                path: "/"
                            });
                        }else{
                            console.log("Failed to logout");
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }}><CiLogout /><span>logout</span></button>
            </div>
        </aside>
    )
}
