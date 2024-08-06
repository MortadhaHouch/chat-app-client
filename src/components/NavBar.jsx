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
        <header className="text-light bg-dark">
            <nav
                className="navbar navbar-expand-sm"
            >
                <div className="container">
                    <NavLink className="navbar-brand text-light" to="/">home</NavLink>
                    <button
                        className="navbar-toggler d-lg-none"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapsibleNavId"
                        aria-controls="collapsibleNavId"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="collapsibleNavId">
                        <ul className="navbar-nav me-auto mt-2 mt-lg-0">
                            {
                                isLoading || JSON.parse(localStorage.getItem("isLoggedIn")) ?
                                (
                                    <>
                                        <li className="nav-item">
                                            <NavLink className="nav-link text-light" to="/chat">chat</NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink className="nav-link text-light" to="/video">video</NavLink>
                                        </li>
                                    </>
                                ):(
                                    <>
                                        <li className="nav-item">
                                            <NavLink className="nav-link text-light" to="/login">login</NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink className="nav-link text-light" to="/signup">signup</NavLink>
                                        </li>
                                    </>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}