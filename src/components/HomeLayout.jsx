import Footer from './Footer'
import { Outlet } from "react-router-dom"
import store from '../../reducers/store';
import NavBar from './NavBar';
export default function HomeLayout() {
    let isLoggedIn = store.getState().isLoggedIn;
    return (
        <>
            {
                !(isLoggedIn && JSON.parse(localStorage.getItem("isLoggedIn"))) && (
                    <NavBar/>
                )
            }
            <Outlet/>
            {
                !(isLoggedIn && JSON.parse(localStorage.getItem("isLoggedIn"))) && (
                    <Footer/>
                )
            }
        </>
    )
}
