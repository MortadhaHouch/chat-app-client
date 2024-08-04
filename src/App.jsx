import { createContext, useState } from 'react'
import './App.css'
import Home from './components/Home'
import {CookiesProvider } from "react-cookie"
let userContext;
function App() {
  let [user,setUser] = useState(null);
  userContext = createContext(user);
  return (
    <>
      <CookiesProvider>
        <userContext.Provider value={{user,setUser}}>
          <Home/>
        </userContext.Provider>
      </CookiesProvider>
    </>
  )
}

export {App,userContext}