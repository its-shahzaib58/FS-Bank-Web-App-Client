import { RightOutlined, SearchOutlined } from '@ant-design/icons';
import { useAccountsContext } from 'contexts/AccountsContext'
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Accounts() {
  const { accounts } = useAccountsContext();
  const [accountsData, setAccountsData] = useState([]);
  const [searchAccount, setSearchAccount] = useState("");
  useEffect(()=>{
    setAccountsData(accounts)
  },[])
  return (

    <div className="main_content_accounts">
      <div className="top">
        <span>Accounts</span>
      </div>
      <div className="search">
        <div className="input-group mb-3">
          <button className="btn btn-secondary"  id="button-addon1"><SearchOutlined /></button>
          <input type="text" className="form-control" placeholder="Search Account via CNIC and IBAN" onChange={(e)=>setSearchAccount(e.target.value)}/>
        </div>
      </div>
      <div className='list_accounts'>
        <div className="list_head">
          <div className="list_item_head">
            <div className='Sr'>Sr#</div>
            <div className='ac_title'>Account Title</div>
            <div className='iban'>IBAN</div>
          </div>
        </div>
        <div className="list_body">
          {
            accountsData.filter((account)=>{
              return searchAccount === ""
              ? account
              : account.cnic.toLowerCase().includes(searchAccount) ||
               account.iban.toLowerCase().includes(searchAccount)
            }).map((account, i) => {
        
              if(account==="")
              {
                return console.log("account is:",account)
                // return <div className='list_item'>
                //   <div>
                //   Account Not Found
                //   </div>
                // </div>
              }
              return (
                <Link to={"/account/" + account.iban}>
                  <div className="list_item"key={i}>
                    <div className='Sr'>{i + 1}</div>
                    <div className='ac_title'>{account.ac_data_encryped.firstname + " " + account.ac_data_encryped.lastname}</div>
                    <div className='iban'>{account.iban}</div>
                    <div className='arrow_right'><RightOutlined /></div>
                  </div>
                </Link>
              )
            })
          }
        </div>
        
      </div>
    </div>

  )
}
