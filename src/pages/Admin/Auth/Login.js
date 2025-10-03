import React, { useState } from 'react'
import { LoadingOutlined, LoginOutlined } from '@ant-design/icons';
import axios from 'axios';
import { notification } from 'antd';
import { useAdminAuthContext } from 'contexts/AdminAuthContext';
import { jwtDecode } from 'jwt-decode';

const initState = { username: "", password: "" }

export default function Login() {

  const [loginData, setLoginData] = useState(initState);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAdminAuthContext();
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message,
      description
    });
  };
  // Get Input Values
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  }
  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true)
    axios.post('https://fs-bank-web-app-server.onrender.com/auth/login', loginData).then((res) => {
      if (res.data.message === "Password is incorrect! Try Again" || res.data.message === "This username is not exist!") {
        openNotificationWithIcon("error", res.data.message)
        setIsLoading(false)
        return setLoginData(initState)
      }
      openNotificationWithIcon("success", res.data.message)
      window.sessionStorage.setItem("token", res.data.token)
      setLoginData(initState)
      const decodeAdmin = jwtDecode(res.data.token);
      const userData = decodeAdmin.userData;
      dispatch({ type: "LOGGED_IN", payload: userData })
      
      setIsLoading(false)


    }).catch((error) => {
      openNotificationWithIcon("error",error.message,"Server is disconnected! Try Again")
      setIsLoading(false)
    })

  }
  return (
    <>
      {contextHolder}
      <div className="main-login-bg">
      </div>
      <div className="main-login">
        <div className="login-top">
          <div className="login-left-side"></div>
          <div className="login-center-side">
            <div className="login-box">
              <div className="top">
                <span className='text-center'>Welcome to</span>
                <h5>FS Bank</h5>
              </div>
              <div className="bottom">
                <h4 className='text-center'>Login</h4>
                <form onSubmit={(e) => handleLogin(e)} method='POST' name='form01' >
                  <label className='label_username'>Username:</label>
                  <input type="text" name="username" className='form-control' id="username_input" value={loginData.username} onChange={(e) => handleChange(e)} placeholder='Enter username' required autoComplete='admin1' />
                  <b className='input_error'>Username is required!</b>
                  <br />
                  <label className='label'>Password:</label>
                  <input type="password" className='form-control' name="password" value={loginData.password} onChange={(e) => handleChange(e)} placeholder='Enter password' required />
                  <b className='input_error'>Password is required!</b>
                  {/* <Link>Forgotten Password?</Link> */}
                  <button type="submit" disabled={isLoading}>
                    {
                      !isLoading ?
                        <>
                          Login
                          <LoginOutlined />
                        </>
                        :
                        <LoadingOutlined />
                    }
                  </button>

                </form>
              </div>
            </div>
          </div>
          <div className="login-right-side"></div>
        </div>
        <div className="footer">
          <span>All Copyrights Reserved 2023 &copy; FS Bank Online Develop by M. Shahzaib Ramzan</span>
        </div>
      </div>
    </>
  )
}
