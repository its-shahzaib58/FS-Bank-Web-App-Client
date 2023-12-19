import { useAccountsContext } from 'contexts/AccountsContext';
import { useAdminAuthContext } from 'contexts/AdminAuthContext'
import React from 'react'

export default function Dashboard() {
  const {user} = useAdminAuthContext();
  const {accounts} = useAccountsContext();
  return (
    <div>
      <h6>Welcome! {user.username}</h6>
      <h5>Our Customer's <span className='text-light fw-bold bg-primary p-3 w-100 h-100 rounded-circle '>{accounts.length}</span></h5>
    </div>
    
  )
}
