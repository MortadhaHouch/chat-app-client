/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import Logo from "../assets/wallpaperflare.com_wallpaper (37).jpg"
export default function ChatHeader(props) {
    return (
        <header className="w-100 h-auto d-flex flex-row justify-content-center align-items-center">
            <div>
                <img width={50} height={50} src={Logo} alt="" style={{
                    border:`2px solid ${props.isConnected ? "lightgreen":"red"}`,
                    marginRight:"10px",
                    borderRadius:10
                }}/>
            </div>
            <div className="d-flex justify-content-center align-items-center">
                {
                    props.connections && (
                        <button className="btn btn-primary" disabled >{props.connections}</button>
                    )
                }
                <button className="btn btn-primary">audio call</button>
                <button className="btn btn-secondary">video call</button>
            </div>
        </header>
    )
}
