import './App.css'
import {CookiesProvider } from "react-cookie"
import {UserContextProvider} from "../providers/UserContextProvider"
import HomeLayout from './components/HomeLayout'
import { ThemeContextProvider } from '../providers/ThemeContextProvider'
function App() {
  document.onload = () =>{
    if(document.readyState == "complete"){
      if(document.cookie.jwt_token == null || document.cookie.jwt_token == ""){
        localStorage.clear();
      }
    }
  }
  return (
    <>
      <CookiesProvider>
        <ThemeContextProvider>
          <UserContextProvider>
            <HomeLayout/>
          </UserContextProvider>
        </ThemeContextProvider>
      </CookiesProvider>
    </>
  )
}

export {App}