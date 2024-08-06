/* eslint-disable react/prop-types */
import { createContext, useState } from "react"

let UserContext = createContext();
function UserContextProvider({children}){
    let [isLoggedIn,setIsLoggedIn] = useState(false);
    return (
        <UserContext.Provider value={{isLoggedIn,setIsLoggedIn}}>
            {children}
        </UserContext.Provider>
    )
}
export {UserContext,UserContextProvider}