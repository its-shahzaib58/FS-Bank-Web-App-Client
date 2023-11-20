import { useAdminAuthContext } from 'contexts/AdminAuthContext'
import React from 'react'

export default function Dashboard() {
  const {user} = useAdminAuthContext();
  return (
    <div>
      <h6>Welcome! {user.username}</h6>
    </div>
    
  )
}
