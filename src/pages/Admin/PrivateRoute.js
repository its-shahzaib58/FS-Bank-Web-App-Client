import { useAdminAuthContext } from 'contexts/AdminAuthContext'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({Component}) {
  const {isAuth} = useAdminAuthContext();
  const location = useLocation()
  if (!isAuth)
  return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
  return (
    <Component/>
  )
}
