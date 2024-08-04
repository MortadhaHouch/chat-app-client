import { useState } from "react";
// import {jwtDecode} from "jwt-decode";
import { fetchData } from "../../utils/fetchData"
export default function Login() {
    let [isLoading,setIsLoading] = useState(false);
    let [email,setEmail] = useState("");
    let [password,setPassword] = useState("");
    async function handleSubmit(){
        try {
            let request = await fetchData("/user/login","POST",{
                email:email.trim(),
                password:password.trim(),
            },"json",setIsLoading);
            console.log(request);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <main className="d-flex flex-column justify-content-center align-items-center w-100 h-auto">
            <form method="post" onSubmit={handleSubmit} className="d-flex flex-column flex-column justify-content-center align-items-center w-25">
                <div className="mb-3 w-100 d-flex flex-column justify-content-center align-items-center">
                    <label htmlFor="" className="form-label">email</label>
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
                    <label htmlFor="" className="form-label">password</label>
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