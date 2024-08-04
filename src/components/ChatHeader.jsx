/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import Logo from "../assets/wallpaperflare.com_wallpaper (37).jpg"
export default function ChatHeader(props) {
    return (
        <header>
            <div>
                <img src={Logo} alt="" style={{
                    border:`5px solid ${props.isConnected ? "lightgreen":"red"}`,
                    marginRight:"10px"
                }}/>
                <h2>{props.name}</h2>
            </div>
            <div className="d-flex justify-content-center align-items-center">
                <button className="btn btn-primary" disabled >{props.connections}</button>
                <button className="btn btn-primary">audio call</button>
                <button className="btn btn-secondary">video call</button>
                <button className="btn btn-info" onClick={()=>{
                    props.setIsShown(!props.isShown);
                }}>
                    <span className="navbar-toggler-icon"></span>
                </button>
            </div>
        </header>
    )
}
