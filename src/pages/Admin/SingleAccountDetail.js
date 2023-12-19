
import { EditOutlined } from '@ant-design/icons';
import { useAccountsContext } from 'contexts/AccountsContext';
import dayjs from 'dayjs';
import React from 'react'
import { useParams } from 'react-router-dom'

export default function SingleAccountDetail() {
  const { accounts } = useAccountsContext();
  const params = useParams();
  const iban = params.iban;
  const accountData = accounts.filter((acc) => {
    return acc.iban === iban
  });
  console.log(accountData)
  const handleIbanToAccountNo = (iban) => {
    const lastThirteenDigits = parseInt(iban.slice(-13), 10);
    const formatNumber = lastThirteenDigits.toString().padStart(13, "0");
    return formatNumber;
  }
  return (
    <div className='main_single_account'>
      <div className="top">
        <span>Account Details</span>
      </div>
      <div className="center">
        <div className="personal_details">
          <div className="row  border-bottom">
            <div className="iban">
            <span>IBAN: <h5>{accountData[0].iban}</h5></span>
            {/* <span>System ID: <h5>{accountData[0].ac_data_encryped.system_username}</h5></span> */}
            </div>
            <div className="system_id">
            </div>
          </div>
          <div className="row border-bottom my-3">
            <div className='firstname'>
              <span>First Name: <h5>{accountData[0].ac_data_encryped.firstname}</h5></span>
            </div>
            <div className='lastname'>
              <span>Last Name: <h5>{accountData[0].ac_data_encryped.lastname}</h5></span>
            </div>
            <div className="mothername">
            <span>Mother Name: <h5>{accountData[0].ac_data_encryped.mother_name}</h5></span>
            </div>
          </div>
          <div className="row border-bottom mt-2">
            <div className="cnic">
            <span>CNIC#: <h5>{accountData[0].cnic}</h5></span>
            </div>
            <div className="cnic">
            <span>Date of Birth: <h5>{dayjs(accountData[0].ac_data_encryped.dob).format("DD MMMM, YYYY")}</h5></span>
            </div>
          </div>
          <div className="row mt-2">
            <div className="phoneNo">
              <label >Phone No. </label>
              <div className="input-group mb-3">
                <span className="input-group-text"><b>+92</b></span>
                <input type="text" maxLength='10' minLength='10' className='form-control' name="phone_no" value={accountData[0].ac_data_encryped.phone_no} disabled />
                <span className="btn btn-primary"><b><EditOutlined /></b></span>
              </div>
            </div>
            <div className="email">
              <label>Email Address </label>
              <div className="input-group mb-3">
                <input type="email" className='form-control' name="email" value={accountData[0].ac_data_encryped.email} disabled />
                <span className="btn btn-primary"><b><EditOutlined /></b></span>
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="permanent_address">
              <label>Permanent Address </label>
              <div className="input-group mb-3">
          
              <textarea row='1' className='form-control' name='permanent_address' value={accountData[0].ac_data_encryped.permanent_address} disabled></textarea>
                <span className="btn btn-primary"><b><EditOutlined /></b></span>
              </div>
            </div>
          </div>
          <div className="row my-3">
            <div className="postel_address">
              <label>Postal Address </label>

              <textarea className='form-control' name='postal_address' value={accountData[0].ac_data_encryped.postal_address} disabled></textarea>
            </div>
          </div>
          <h6><b>Accounts Detail of Customer</b></h6>
          <div className="row my-3">
            <div className="account_type">
              <label>Source of Income </label>
              <select className='form-select' name='source_of_income' value={accountData[0].ac_data_encryped.source_of_income}>
                <option value="" selected disabled>Select income source</option>
                <option value="Salary Person">Salary Person</option>
                <option value="Business Holder">Business Holder</option>
              </select>
            </div>
            <div className="account_type">
              <label>Account Type </label>
              <select className='form-select' name='ac_type' value={accountData[0].ac_data_encryped.ac_type}>
                <option value="" selected disabled>Select type</option>
                <option value="Current">Current</option>
                <option value="Saving">Saving</option>
              </select>
            </div>
          </div>
          <div className="row my-3">
            <div className="">
              <label>Plan Type </label>
              <select className='form-select' name='interset_plan' value={accountData[0].ac_data_encryped.interset_plan}>
                <option value="" selected disabled>Select plan</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half Yearly">Half Yearly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
