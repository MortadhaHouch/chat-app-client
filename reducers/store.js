import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "./userReducer";
let store = configureStore({
    reducer:rootReducer
});
export default store;