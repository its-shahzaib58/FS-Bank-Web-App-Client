import React, { useEffect, createContext, useContext, useReducer, useState, } from 'react'
import CryptoJS from 'crypto-js';
import axios from 'axios';

const AccountsContext = createContext()
const initialState = { accounts: {} }

export const authReducer = (state, action) => {
    switch (action.type) {
        case "IN":
            return { accounts: action.payload }
        case "OUT":
            return { accounts: null }
        default:
            return state
    }
}
export default function AccountsContextProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);
    // const [accountsData, setAccountsData] = useState()
    useEffect(() => {
        axios.get("https://fs-bank-web-app-server.vercel.app/accounts")
            .then((res) => {
              var accountsData =  res.data.accounts
                // console.log(accountsData)
                accountsData.map((account,i) => {
                    const bytes = CryptoJS.AES.decrypt(account.ac_data_encryped,process.env.REACT_APP_ENCRYPTION_KEY);
                    const decryped = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                    return accountsData[i].ac_data_encryped = decryped ;
                })
                dispatch({ type: "IN", payload: accountsData })
            })
            .catch((err) => {
                console.error(err)
            })
    }, [])

    return (
        <AccountsContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AccountsContext.Provider>
    )
}

export const useAccountsContext = () => useContext(AccountsContext)