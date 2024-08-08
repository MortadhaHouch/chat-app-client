/* eslint-disable react/prop-types */

import { useContext, useRef } from "react";
import { ThemeContext } from "../../providers/ThemeContextProvider";

/* eslint-disable no-unused-vars */
export default function Popup(props) {
    let theme = useContext(ThemeContext);
    let popupRef = useRef();
    return (
        <section 
            ref={popupRef}
            className={`dialog ${props.isPopupShown?"shown":"hidden"}`}
            style={{
                backgroundColor:(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"rgba(22, 20, 59, 0.75)":"rgba(231, 226, 219, 0.75)",
            }}
        >
            <button 
                className="btn btn-danger btn-close" 
                onClick={()=>{
                    props.setIsPopupShown(false);
                    popupRef.current.classList.replace("shown","hidden");
                }}
                style={{
                    position:"absolute",
                    top:"10px",
                    right:"10px",
                    fontSize:"20px",
                    cursor:"pointer",
                    fontWeight:"bold",
                    backgroundColor:"red",
                    color:(theme.isDark || JSON.parse(localStorage.getItem("isDark")))?"#ffffff":"#000000",
                }}
            ></button>
            <div>
            </div>
        </section>
    )
}
