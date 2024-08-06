/* eslint-disable react/prop-types */
import { createContext, useState } from "react"

let ThemeContext = createContext();
function ThemeContextProvider({children}){
    let [isDark,setIsDark] = useState(false);
    return (
        <ThemeContext.Provider value={{isDark,setIsDark}}>
            {children}
        </ThemeContext.Provider>
    )
}
export {ThemeContext,ThemeContextProvider}