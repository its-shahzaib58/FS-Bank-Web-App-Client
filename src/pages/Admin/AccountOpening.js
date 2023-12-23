import React, { useState } from 'react'
import dayjs from 'dayjs';
import CryptoJS from 'crypto-js';
import { ConfigProvider, Popconfirm, message, notification } from 'antd';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';
import water_drop from '../../assets/audio/water_droplet.mp3';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthContext } from 'contexts/AdminAuthContext';
import { useAccountsContext } from 'contexts/AccountsContext';
const initStateAccountData = {
  // Non Encryped Data
  iban: "",
  cnic: "",
  // Encryped Data
  firstname: "",
  lastname: "",
  mother_name: "",
  dob: "",
  phone_no: "",
  email: "",
  permanent_address: "",
  postal_address: "",
  source_of_income: "",
  ac_type: "",
  interset_plan: "",
}
export default function AccountOpening() {
  const { user } = useAdminAuthContext();
  const { accounts, dispatch } = useAccountsContext();
  const [accountsData, setAccountsData] = useState(accounts);
  const notificationSound = new Audio(water_drop);
  notificationSound.loop = false;
  const [isLoading, setIsLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [accountData, setAccountData] = useState(initStateAccountData);
  const [permanentAddress, setPermanentAddress] = useState("");
  const [postalAddress, setPostalAddress] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("");
  const [sameAddress, setSameAddress] = useState(false);
  const [accountNumberFunctionIsCompleted, setAccountNumberFunctionIsCompleted] = useState(false)
  const [minDateDob] = useState(dayjs().subtract(18, 'year').format("YYYY-MM-DD"));
  // Notification Function
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message,
      description
    });
  };

  // Same As Above Address Functions
  const handleChangePermanentAdd = e => {
    setPermanentAddress(e.target.value);
    if (sameAddress) {
      setPostalAddress(e.target.value);
    }
  }
  const handleChangePostalAdd = e => {
    setPostalAddress(e.target.value)
  }
  const handleSameAsAbove = e => {
    setSameAddress(!sameAddress)
    if (!sameAddress) {
      setPostalAddress(permanentAddress)
    } else {
      setPostalAddress("")
    }
  }
  // Show Plan Function
  const handleChangeAccountType = e => {
    setAccountType(e.target.value)
  }
  // Getting Value of  Inputs
  const handleChange = e => {
    setAccountData({ ...accountData, [e.target.name]: e.target.value });
  }
  // Generate Account Number Function
  const handleGenerateIban = () => {
    // Validation Start

    if (accountData.firstname === "") {
      return message.warning("Please Enter Firstname")
    }
    if (accountData.firstname === "") {
      return message.warning("Please Enter Firstname")
    }
    if (accountData.lastname === "") {
      return message.warning("Please Enter Lastname")
    }
    if (accountData.mother_name === "") {
      return message.warning("Please Enter Mother Name  ")
    }
    if (accountData.cnic.length < 13) {
      return message.warning("Please Enter Vaild CNIC")
    }
    if (accountData.firstname === "") {
      return message.warning("Please Enter Firstname")
    }
    if (accountData.dob === "") {
      return message.warning("Please Enter Date of Birth")
    }
    if (accountData.dob > minDateDob) {
      return message.warning("Please Enter Valid Date of Birth")
    }
    if (accountData.phone_no === "") {
      return message.warning("Please Enter Phone Number")
    }
    if (accountData.email === "") {
      return message.warning("Please Enter Email Address")
    }
    if (permanentAddress === "") {
      return message.warning("Please Enter Permanent Address")
    }
    if (postalAddress === "") {
      return message.warning("Please Enter Postal Address")
    }

    if (accountData.source_of_income === "") {
      return message.warning("Please Select Source of Income")
    }

    if (accountType === "") {
      return message.warning("Please Select Account Type")
    }
    if (accountType === "Saving" && accountData.interset_plan === "") {
      return message.warning("Please Select Interset Plan")
    }
    // Validation End
    setGenerateLoading(true)
    axios.get("https://fs-bank-web-app-server.vercel.app/accounts/lastibannumber")
      .then((res) => {
        if (!res.data.lastIban) {
          setAccountNumber("PK001FSB0000000000001");
          setAccountNumberFunctionIsCompleted(true)
          setGenerateLoading(false)
        } else {
          const lastThirteenDigits = parseInt(res.data.lastIban.slice(-13), 10) + 1;
          // console.log(lastElevenDigits);
          const formatNumber = lastThirteenDigits.toString().padStart(13, "0");
          // console.log(formatNumber);
          const newAccountNumber = `PK001FSB${formatNumber}`;
          setAccountNumber(newAccountNumber);
          setAccountNumberFunctionIsCompleted(true);
          setGenerateLoading(false);

        }
      }).catch((error) => {
        setAccountNumberFunctionIsCompleted(false)
        notificationSound.play();
        return openNotificationWithIcon("error", "Account Generating Error!");

      })
  }
  // Handle Submit Account Data
  const handleSubmit = e => {
    setIsLoading(true)
    if (!accountNumberFunctionIsCompleted) {
      notificationSound.play()
      openNotificationWithIcon("warning", "Please First Generate IBAN!");
      setIsLoading(false)
    }
    // Creating EncrypedAccountData Object
    const accountDataBeforeEncryped = {
      firstname: accountData.firstname,
      lastname: accountData.lastname,
      mother_name: accountData.mother_name,
      dob: accountData.dob,
      phone_no: accountData.phone_no,
      email: accountData.email,
      permanent_address: permanentAddress,
      postal_address: postalAddress,
      source_of_income: accountData.source_of_income,
      ac_type: accountType,
      interset_plan: accountData.interset_plan,
      ac_balance: 0,
      createdAt: dayjs().format(),
      system_username: user.username
    }


    const accountDataAfterEncryped = CryptoJS.AES.encrypt(JSON.stringify(accountDataBeforeEncryped), process.env.REACT_APP_ENCRYPTION_KEY).toString();

    // Creating Final Object Will Be Send to DB
    if (accountNumberFunctionIsCompleted) {
      // Before Encrpyed Final Account Data
      const finalAccountData = {
        iban: accountNumber,
        cnic: accountData.cnic,
        ac_data_encryped: accountDataBeforeEncryped,
      }
      // After Encrpyed Final Account Data
      const finalAccountDataEncryped = {
        iban: accountNumber,
        cnic: accountData.cnic,
        ac_data_encryped: accountDataAfterEncryped,
      }
      axios.post("https://fs-bank-web-app-server.vercel.app/accounts/openaccount", finalAccountDataEncryped)
        .then((res) => {
          if (res.data.message.index === 0) {
            setIsLoading(false)
            console.log(res.data.message)
            notificationSound.play()
            setAccountNumberFunctionIsCompleted(false)
            setAccountNumber("")
            return openNotificationWithIcon("error", `This Customer Already Exist! CNIC:${res.data.message.keyValue.cnic}`);
          }
          // Eamil Sending
          const EmailData = {
            to: accountDataBeforeEncryped.email,
            subject: "FS BANK | Account Opening",
            html: `
            <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://gitfonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
                <title>FS Bank</title>
                <style>
                  body {
                    font-family: 'Montserrat', sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                  }

                  .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }

                  h1 {
                    color: #333;
                  }

                  p {
                    color: #555;
                  }

                  .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #007BFF;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 3px;
                  }

                  .footer {
                    margin-top: 20px;
                    padding-top: 10px;
                    border-top: 1px solid #ddd;
                    text-align: center;
                    color: #777;
                  }
                </style>
              </head>

              <body>
                <div class="container">
                  <h3>Welcome to</h3>
                  <img width="150"
                    src="https://res.cloudinary.com/de52siew7/image/upload/f_auto,q_auto/v1/FS_BANK/fsbanklogo" />
                    <h1>Hello, ${accountDataBeforeEncryped.firstname}</h1>
                    <p>Congratulations on opening your new bank account with us. We are delighted to have you as our valued customer.</p>
                    
                    <p>Your International Bank Account Number (IBAN) is:</p>
                    <div class="iban">IBAN: ${finalAccountDataEncryped.iban}</div>
                
                  <div class="footer">
                    <p class="note">Please keep this information secure and do not share it with anyone. If you have any questions or need assistance, feel free to contact our customer support.</p>
                  </div>
                </div>
              </body>
              </html>
            `
          }
          axios.post("https://fs-bank-web-app-server.vercel.app/send-email", EmailData).then((res) => {
            console.log(res.status)
          });
          setAccountData(initStateAccountData)
          setAccountType("");
          setPermanentAddress("");
          setPostalAddress("");
          setSameAddress(false)
          setIsLoading(false)
          notificationSound.play()
          openNotificationWithIcon("success", res.data.message)
          setAccountNumberFunctionIsCompleted(false)
          setAccountNumber("")
          setAccountsData(accounts.push(finalAccountData))
          dispatch({ type: "IN", payload: accountsData });
        }).catch((err) => {
          setIsLoading(false)
          notificationSound.play()
          return openNotificationWithIcon("error", "Server Error!")
        });
    }
  }
  return (
    <>
      {contextHolder}
      <div className="main_content_opening_account">
        <div className="top">
          <span>Account Opening</span>
        </div>
        <div className="center">
          <div className="personal_details">
            <h6><b>Personal Details of Customer</b></h6>
            <div className="row">
              <div className='firstname'>
                <label>1. First Name  <span className="text-danger">*</span></label>
                <input type="text" onChange={(e) => { handleChange(e) }} className='form-control' name="firstname" value={accountData.firstname} placeholder='Enter firstname' />
              </div>
              <div className='lastname'>
                <label>2. Last Name    <span className="text-danger">*</span></label>
                <input type="text" onChange={(e) => { handleChange(e) }} className='form-control' name="lastname" value={accountData.lastname} placeholder='Enter lastname' />
              </div>
            </div>
            <div className="row mt-2">
              <div className="mothername">
                <label>3. Mother Name  <span className="text-danger">*</span></label>
                <input type="text" onChange={(e) => { handleChange(e) }} className='form-control' name="mother_name" value={accountData.mother_name} placeholder='Enter mother name' />
              </div>
            </div>
            <div className="row mt-2">
              <div className="cnic">
                <label>4. CNIC No.  <span className="text-danger">*</span></label>
                <input type="number" onChange={(e) => { handleChange(e) }} className='form-control' name="cnic" value={accountData.cnic} placeholder='Enter CNIC No without dashes' maxLength="13" />
              </div>
              <div className="cnic">
                <label>5. Date of Birth  <span className="text-danger">*</span></label>
                <input type="date" onChange={(e) => { handleChange(e) }} className='form-control' name="dob" value={accountData.dob} max={minDateDob} />
              </div>
            </div>
            <div className="row mt-2">
              <div className="phoneNo">
                <label >6. Phone No.  <span className="text-danger">*</span></label>
                <div className="input-group mb-3">
                  <span className="input-group-text"><b>+92</b></span>
                  <input type="text" maxLength='10' minLength='10' onChange={(e) => { handleChange(e) }} className='form-control' name="phone_no" value={accountData.phone_no} placeholder='Enter Phone No ' />
                </div>
              </div>
              <div className="email">
                <label>7.  Email Address  <span className="text-danger">*</span></label>
                <input type="email" onChange={(e) => { handleChange(e) }} className='form-control' name="email" value={accountData.email} placeholder='Enter Email Address' />
              </div>
            </div>
            <div className="row mt-2">
              <div className="permanent_address">
                <label>8.  Permanent Address  <span className="text-danger">*</span></label>
                <textarea row='1' className='form-control' onChange={(e) => { handleChangePermanentAdd(e) }} name='permanent_address' value={permanentAddress} placeholder='Enter Permanent Address'></textarea>
              </div>
            </div>
            <div className="row my-3">
              <div className="postel_address">
                <label>9.  Postal Address  <span className="text-danger">*</span></label>
                <label className='sameAsAbove' htmlFor="sameAsAbove">Same as above  &nbsp;  <input type="checkbox" className='form-check-input' id="sameAsAbove" onChange={(e) => handleSameAsAbove(e)} checked={sameAddress} /></label>
                <textarea className='form-control' disabled={sameAddress} value={postalAddress} onChange={(e) => { handleChangePostalAdd(e) }} name='postal_address' placeholder='Enter Postal Address'></textarea>
              </div>
            </div>
            <h6><b>Accounts Detail of Customer</b></h6>
            <div className="row my-3">
              <div className="account_type">
                <label>10.  Source of Income  <span className="text-danger">*</span></label>
                <select className='form-select' onChange={(e) => { handleChange(e) }} name='source_of_income' value={accountData.source_of_income}>
                  <option value="" selected disabled>Select income source</option>
                  <option value="Salary Person">Salary Person</option>
                  <option value="Business Holder">Business Holder</option>
                </select>
              </div>
              <div className="account_type">
                <label>11.  Account Type  <span className="text-danger">*</span></label>
                <select className='form-select' value={accountType} name='ac_type' onChange={(e) => handleChangeAccountType(e)}>
                  <option value="" selected disabled>Select type</option>
                  <option value="Current">Current</option>
                  <option value="Saving">Saving</option>
                </select>
              </div>
            </div>
            <div className="row my-3">
              <div className={accountType === "Saving" ? "plan plan_show" : "plan"}>
                <label>12.  Plan Type  <span className="text-danger">*</span></label>
                <select className='form-select' onChange={(e) => { handleChange(e) }} name='interset_plan' value={accountData.interset_plan}>
                  <option value="" selected disabled>Select plan</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Half Yearly">Half Yearly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </div>
            <div className={"row my-3"} >
              <label htmlFor="">13. Generate IBAN</label>
              <div className="generate_iban">
                <button className='generate_iban_btn' onClick={handleGenerateIban} disabled={accountNumberFunctionIsCompleted}>
                  {
                    !generateLoading ?
                      "Generate IBAN" :
                      <LoadingOutlined />
                  }
                </button>
              </div>
              <div className="show_iban">
                <h4><b>{accountNumber}</b></h4>
              </div>
            </div>
            <div className="row my-3">
              <div className="submit_btn">
                <ConfigProvider>
                  <Popconfirm
                    placement="top"
                    title="Are you sure to submit account details?"
                    description="Please check first all submition details of account opening."
                    onConfirm={(e) => { handleSubmit(e) }}
                    okText="Yes"
                    cancelText="No"
                  >

                    <button className={!accountNumberFunctionIsCompleted ? "d-none" : "d-block"}>
                      {
                        !isLoading ?
                          "Submit" :
                          <LoadingOutlined />
                      }
                    </button>
                  </Popconfirm>
                </ConfigProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
