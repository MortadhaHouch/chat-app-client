import { useState } from "react";
import { fetchData } from "../../utils/fetchData"
export default function Signup() {
    let [isLoading,setIsLoading] = useState(false);
    let [firstName,setFirstName] = useState("");
    let [lastName,setLastName] = useState("");
    let [date,setDate] = useState("");
    let [avatar,setAvatar] = useState(null);
    let [email,setEmail] = useState("");
    let [password,setPassword] = useState("");
    async function handleSubmit(){
        try {
            let request = await fetchData("/user/signup","POST",{
                email:email.trim(),
                password:password.trim(),
                firstName:firstName.trim(),
                lastName:lastName.trim(),
                date:date.trim(),
                avatar,
            },"blob",setIsLoading);
            console.log(request);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <main className="d-flex flex-column justify-content-center align-items-center w-100 h-auto">
            <form action="" method="post" onSubmit={handleSubmit} className="d-flex flex-column flex-column justify-content-center align-items-center w-25">
                <div className="mb-3 w-100 d-flex flex-column justify-content-center align-items-center">
                    <label htmlFor="" className="form-label">first name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        id="first name"
                        aria-describedby="helpId"
                        placeholder="name"
                        onChange={(e)=>setFirstName(e.target.value)}
                        value={firstName}
                        required
                    />
                </div>
                <div className="mb-3 w-100 d-flex flex-column justify-content-center align-items-center">
                    <label htmlFor="" className="form-label">last name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="lastName"
                        id="lastName"
                        aria-describedby="helpId"
                        placeholder="name"
                        onChange={(e)=>setLastName(e.target.value)}
                        value={lastName}
                        required
                    />
                </div>
                <div className="mb-3 w-100 d-flex flex-column justify-content-center align-items-center">
                    <label htmlFor="" className="form-label">birth day</label>
                    <input
                        type="date"
                        className="form-control"
                        name="date"
                        id="date"
                        aria-describedby="helpId"
                        placeholder="date"
                        onChange={(e)=>setDate(e.target.value)}
                        value={date}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="" className="form-label">avatar</label>
                    <input
                        type="file"
                        className="form-control"
                        name="file"
                        id="file"
                        aria-describedby="helpId"
                        onChange={(e)=>setAvatar(e.target.files[0])}
                    />
                </div>
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
                <button type="submit" className="btn btn-info" disabled={isLoading}>signup</button>
                <p>{isLoading?"loading":"not loading"}</p>
            </form>
        </main>
    )
}