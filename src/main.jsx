import React from 'react'
import ReactDOM from 'react-dom/client'
import {Route,createBrowserRouter,createRoutesFromElements,RouterProvider} from "react-router-dom";
import Chat from './components/Chat.jsx';
import {App} from "./App";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap";
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import VideoChat from "./components/VideoChat"
import {CookiesProvider} from "react-cookie"
import store from "../reducers/store.js";
import Error from './components/Error.jsx';
store.subscribe(()=>{
  console.log("data store connected");
})
let {isLoggedIn} = store.getState().isLoggedIn;
let router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<App/>}>
      {
        isLoggedIn|| JSON.parse(localStorage.getItem("isLoggedIn")) ? (
          <>
            <Route path="chat" element={<Chat/>}/>
            <Route path="video" element={<VideoChat/>}/>
          </>
        ):(
          <>
            <Route path="login" element={<Login/>}/>
            <Route path="signup" element={<Signup/>}/>
          </>
        )
      }
      <Route path="*" element={<Error/>}/>
    </Route>
  )
)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CookiesProvider>
      <RouterProvider router={router}/>
    </CookiesProvider>
  </React.StrictMode>,
)
