import { Route, Router, Routes } from 'react-router-dom';
import React, { useState } from 'react'
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import AccountOpening from './AccountOpening';
import Dashboard from './Dashboard';
import Accounts from './Accounts';
import SingleAccountDetail from './SingleAccountDetail';
export default function Index() {
  const [isAuth] = useState(true)
  return (
    <>
    
      <Header />
      <div className="main-app">
        <Sidebar/>
        <div className="content">
          <Routes>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/accountopening' element={<AccountOpening/>}/>
            <Route path='/accounts' element={<Accounts/>}/>
            <Route path='/account/:iban' element={<SingleAccountDetail/>}/>
          </Routes>
        </div>
      </div>
    </>
  )
}
