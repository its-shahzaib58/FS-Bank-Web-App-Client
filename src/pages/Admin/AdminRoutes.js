import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './index';
import Login from './Auth/Login';
import PrivateRoute from './PrivateRoute';
import { useAdminAuthContext } from 'contexts/AdminAuthContext';

export default function Index() {
  const {isAuth} = useAdminAuthContext();
  return (
    <>
      <Routes>
        <Route path="/*" element={<PrivateRoute Component={Home} />} />
        <Route path="/auth/login" element={!isAuth ? <Login /> : <Navigate to="/"/>} />
      </Routes>
    </>
  )
}
