import React, { useState } from 'react';
import { Layout, Card, Button, Input, message, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../Inspect/logo.png";
import Smartlogo from "../../Inspect/Smart-logo.png";
import InputMask from "react-input-mask";

import './Login.scss'
import axios from 'axios';
const { Content } = Layout;

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeForm, setActiveForm] = useState('login');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleTabChange = (formType) => {
    setActiveForm(formType);
  };

  const loginUser = () => {
    setLoading(true);
    const loginPayload = {
      email: email,
      password: password
    };
    if (!loginPayload.email || !loginPayload.password) {
      message.error("Please enter your email and password");
      setLoading(false);
    }
    else {
      axios.post(`${process.env.REACT_APP_BASE_API_URL}/login/`, loginPayload)
        .then(resp => {
          console.log("responce", resp)
          localStorage.setItem('accessToken', resp.data.access);
          localStorage.setItem('userinfo', resp.data?.is_superuser)
          localStorage.setItem('userid', resp.data?.company_id)
          console.log("hiii logion")
          setLoading(false);
          window.location.reload()
        })
        .catch(error => {
          setLoading(false);
          console.log(error)
          message.error(error?.response?.data?.detail)
        })
    }
  };
  const registerUser = () => {
    setLoading(true);
    if (!firstName || !lastName || !company || !phone || !registerEmail || !registerPassword) {
      message.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    const registerPayload = {
      first_name: firstName,
      last_name: lastName,
      company_name: company,
      phone_number: phone,
      email: registerEmail,
      password: registerPassword,
      is_active: "true",
    };
    axios.post(`${process.env.REACT_APP_BASE_API_URL}/register/`, registerPayload)
      .then(resp => {
        console.log(resp)
        message.success("Registration successful");
        setLoading(false)
        setTimeout(() => {
          handleTabChange('login')
        }, 2000);
      })
      .catch(error => {
        console.log(error?.response?.data?.email)
        message.error(error?.response?.data?.email)
        setLoading(false)
      });
  };

  return (
    <Layout className='main-layout' style={{ width: '100%', height: '100vh' }}>
      <Content className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card className="custom-card" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <div className='custom-title'>
            <img src={Smartlogo} className='Smart-connect-logo' alt="" />
          </div>

          <div className='tab-container'>
            <button type='primary'
              className={activeForm === 'login' ? 'button-style active-button-style' : 'button-style'}
              onClick={() => handleTabChange('login')}
            >
              Login
            </button>
            <button type='primary'
              className={activeForm === 'signup' ? 'button-style active-button-style' : 'button-style'}
              onClick={() => handleTabChange('signup')}
            >
              Sign up
            </button>
          </div>
          <div className="tab-content">
            {activeForm === 'login' ? (
              <>
                <h1 className="section-title">Welcome</h1>
                <p className='section-pera'>Sign in to continue</p>
                <form className="login-form">
                  <Input id="loginemail" className="form-input" placeholder="Enter your email or username" onChange={(e) => setEmail(e.target.value)} required />
                  <Input.Password id="loginPassword" className="form-input" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                  <Link className='forget-password-link' to={'/forgetpassword'}>Forgot password?</Link>
                  <Button type="primary" className="form-button" onClick={loginUser}>
                    {loading ? <Spin /> : "Login"}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <p className="section-title">Create Account</p>
                <p className='section-pera'>Sign up to get started!</p>
                <form className="signup-form">
                  <div className='signup-form-names-fields'>
                    <Input type="text" id="signupFirstName" className="form-input" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} />
                    <Input type="text" id="signupLastName" className="form-input" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} />
                  </div>
                  <div className='signup-form-names-fields'>
                    <Input type="email" id="signupEmail" className="form-input" onChange={(e) => setRegisterEmail(e.target.value)} placeholder="Your email" />
                    <InputMask
                      id="Phone" className="form-input"
                      style={{ width: "95%", marginLeft: "5px", height: "2.8rem", borderRadius: "8px", border: "0.0625rem solid #B0E1F2", paddingLeft: "8px", color: "black", transition: "border-color 0.3s", }}
                      mask="+33 9 99 99 99 99"
                      maskChar=""
                      placeholder="+33 1 23 45 67 89"
                      onChange={(e) => setPhone(e.target.value)}
                    >
                    </InputMask>
                  </div>
                  {/* <div className='signup-form-names-fields'> */}
                  <Input id="Company" className="form-input" placeholder="Company" onChange={(e) => setCompany(e.target.value)} />
                  <Input.Password id="signupPassword" className="form-input" onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Password" />
                  {/* </div> */}
                  <Button type="primary" className="form-button" onClick={registerUser}>
                    {loading ? <Spin /> : "Sign up"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </Card>
      </Content>
    </Layout>
  );
}

export default App;
