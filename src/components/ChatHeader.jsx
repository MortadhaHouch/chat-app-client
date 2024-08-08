/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import Logo from "../assets/wallpaperflare.com_wallpaper (37).jpg"
export default function ChatHeader(props) {
    return (
        <header className="w-100 h-auto d-flex flex-row justify-content-center align-items-center" style={{
            top:props.discussion?"0":"-200px"
        }}>
            <div className="d-flex flex-row justify-content-center align-items-center">
                <img width={50} height={50} src={(props.discussion || props.user) && props.user.avatar} alt="" style={{
                    border:`2px solid ${props.users && props.users.filter((item)=>item.isLoggedIn).length == 0 || (props.user && props.user.isLoggedIn) ? "lightgreen":"red"}`,
                    marginRight:"10px",
                    borderRadius:10
                }}/>
                <h3>{props.user && props.user.firstName+" "+ props.user.lastName}</h3>
            </div>
            <div className="d-flex justify-content-center align-items-center">
                {
                    props.user && (
                        <>
                            <button className="btn btn-primary" disabled={props.user.isAudioCalling}>audio call</button>
                            <button className="btn btn-secondary" disabled={props.user.isVideoCalling}>video call</button>
                        </>
                    )
                }
            </div>
        </header>
    )
}
