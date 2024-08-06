import './App.css'
import {CookiesProvider } from "react-cookie"
import {UserContextProvider} from "../providers/UserContextProvider"
import HomeLayout from './components/HomeLayout'
import { ThemeContextProvider } from '../providers/ThemeContextProvider'
function App() {
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