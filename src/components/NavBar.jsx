/* eslint-disable no-unused-vars */
import { NavLink } from "react-router-dom";
import store from "../../reducers/store";
import { fetchData } from "../../utils/fetchData";
import sign from "jwt-encode";
import { useState } from "react";
store.subscribe(()=>{
    console.log("data store connected");
})
export default function NavBar() {
    let {isLoggedIn} = store.getState().isLoggedIn;
    let [isLoading,setIsLoading] = useState(false);
    return (
        <nav
            className="navbar navbar-expand-sm navbar-light bg-dark-subtle"
        >
            <div className="container">
                <button
                    className="navbar-toggler d-lg-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#nav-links"
                    aria-controls="collapsibleNavId"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="nav-links">
                    <ul className="navbar-nav me-auto mt-2 mt-lg-0">
                        {
                            isLoggedIn ? (
                                <>
                                    <li className="nav-item">
                                        <NavLink className="nav-link active" to="/video" aria-current="page">
                                            video
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link active" to="chat" aria-current="page">
                                            chat
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn btn-danger" aria-current="page"
                                            onClick={async()=>{
                                                try {
                                                    let request = await fetchData("/user/logout","POST",{
                                                        email:localStorage.getItem("email")
                                                    },"json",setIsLoading)
                                                } catch (error) {
                                                    console.log(error);
                                                }
                                            }}
                                        >
                                            logout
                                        </button>
                                    </li>
                                </>
                            ):(
                                <>
                                    <li className="nav-item">
                                        <NavLink className="nav-link active" to="login" aria-current="page">
                                            login
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link active" to="signup" aria-current="page">
                                            signup
                                        </NavLink>
                                    </li>
                                </>
                            )
                        }
                    </ul>
                </div>
            </div>
        </nav>
        
    )
}