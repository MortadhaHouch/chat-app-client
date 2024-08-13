/* eslint-disable no-unused-vars */
import { useState } from "react";
import {jwtDecode} from "jwt-decode";
import { fetchData } from "../../utils/fetchData"
import { useCookies } from "react-cookie";
import sign from "jwt-encode"
export default function Login() {
    let [isLoading,setIsLoading] = useState(false);
    let [email,setEmail] = useState("");
    let [password,setPassword] = useState("");
    let [cookies,setCookie,removeCookie] = useCookies("jwt_token");
    async function handleSubmit(e){
        e.preventDefault();
        try {
            let request = await fetchData("/user/login","POST",{
                email:email.trim(),
                password:password.trim(),
            },"json",setIsLoading);
            if(jwtDecode(request.token).isVerified){
                let user = jwtDecode(request.token);
                localStorage.setItem("isLoggedIn",user.isVerified);
                localStorage.setItem("email",user.email);
                localStorage.setItem("firstName",user.firstName);
                localStorage.setItem("lastName",user.lastName);
                localStorage.setItem("avatar",user.avatar);
                localStorage.setItem("dateOfBirth",user.dateOfBirth);
                setCookie(
                    "jwt_token",
                    sign({   
                            email:localStorage.getItem("email"),
                            firstName:localStorage.getItem("firstName"),
                            lastName:localStorage.getItem("lastName"),
                        },
                        import.meta.env.VITE_SECRET_KEY
                    ),
                    { 
                        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                        path: '/',
                        sameSite: "strict",
                    },
                )
                location.assign("/chat");
            }else if(jwtDecode(request.token).email_error){
                localStorage.setItem("isLoggedIn",false);
            }
            console.log(jwtDecode(request.token));
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <main className="d-flex flex-column justify-content-center align-items-center w-100 h-auto">
            <form method="post" onSubmit={handleSubmit} className="d-flex flex-column flex-column justify-content-center align-items-center w-25">
                <div className="mb-3 w-100 d-flex flex-column justify-content-center align-items-center">
                    <label htmlFor="email" className="form-label">email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        id="email"
                        aria-describedby="helpId"
                        placeholder="email"
                        onChange={(e)=>setEmail(e.target.value)}
                        value={email}
                        required
                    />
                </div>
                <div className="mb-3 w-100 d-flex flex-column justify-content-center align-items-center">
                    <label htmlFor="password" className="form-label">password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        id="password"
                        aria-describedby="helpId"
                        placeholder="password"
                        onChange={(e)=>setPassword(e.target.value)}
                        value={password}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-info" disabled={isLoading}>login</button>
                <p>{isLoading?"loading":"not loading"}</p>
            </form>
        </main>
    )
}