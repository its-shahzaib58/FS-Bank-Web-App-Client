import React, { useEffect, createContext, useContext, useReducer, } from 'react'
// import {auth} from '../config/firebase';
import { jwtDecode } from 'jwt-decode';

const AdminAuthContext = createContext()
const initialState = { isAuth: false, user: {} }

export const authReducer = (state, action)=>{
    switch (action.type)
    {
        case "LOGGED_IN":
            return {isAuth: true, user: action.payload}
        case "LOGGED_OUT":
            return {isAuth:false, user: null}
        default:
            return state
    }
}
export default function AdminAuthContextProvider({ children }) {
   const [state, dispatch] = useReducer(authReducer, initialState);

   useEffect(()=>{
    const token = window.sessionStorage.getItem("token");
    if(token)
    {
        const adminData = jwtDecode(token).userData;
        dispatch({type:"LOGGED_IN",payload:adminData})
    }
   },[])

    return (
        <AdminAuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AdminAuthContext.Provider>
    )
}

export const useAdminAuthContext = () => useContext(AdminAuthContext)