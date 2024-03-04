import React, { useState } from 'react';
import { Layout, Card, Button, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../../Inspect/logo.png";
import Smartlogo from "../../Inspect/Smart-logo.png";

import './Login.scss'
import axios from 'axios';
const { Content } = Layout;

const Login = () => {
  const navigate = useNavigate();

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
    const loginPayload = {
      email: email,
      password: password
    };
    if (!loginPayload.email || !loginPayload.password) {
      message.error("Please enter your email and password");
    }
    else {
      axios.post('http://smart-connect.eu-west-3.elasticbeanstalk.com/api/login/', loginPayload)
        .then(resp => {
          console.log(resp)
          message.success("Login successful");
          localStorage.setItem('accessToken', resp.data.access);
          navigate("./dashboard")
        })
        .catch(error => {
          console.log(error)
        })
    }
  };
  const registerUser = () => {
    if (!firstName || !lastName || !company || !phone || !registerEmail || !registerPassword) {
      message.error("Please fill in all fields");
      return;
    }

    const registerPayload = {
      first_name: firstName,
      last_name: lastName,
      company: company,
      mobile: phone,
      email: registerEmail,
      password: registerPassword,
      is_active: "true",
    };
    axios.post('http://smart-connect.eu-west-3.elasticbeanstalk.com/api/register/', registerPayload)
      .then(resp => {
        console.log(resp)
        message.success("Registration successful");
        setTimeout(() => {
          handleTabChange('login')
        }, 3000);
      })
      .catch(error => {
        console.log(error)
        message.error("Registration error");
      });
  };

  return (
    <Layout className='main-layout'>
      <Content className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card className="custom-card">
          <div className='custom-title'>
            <img src={Smartlogo} className='logo' alt="" />
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
                  {/* <Link to='/dashboard'> */}
                  <Button type="primary" className="form-button" onClick={loginUser}>
                    Continue
                  </Button>
                  {/* </Link> */}
                </form>
              </>
            ) : (
              <>
                <p className="section-title">Create Account</p>
                <p className='section-pera'>Sign up to get started!</p>
                <form className="signup-form">
                  <Input type="text" id="signupFirstName" className="form-input" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} />
                  <Input type="text" id="signupLastName" className="form-input" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} />
                  <Input id="Company" className="form-input" placeholder="Company" onChange={(e) => setCompany(e.target.value)} />
                  <Input id="Phone" className="form-input" placeholder="Phone" onChange={(e) => setPhone(e.target.value)} />
                  <Input type="email" id="signupEmail" className="form-input" onChange={(e) => setRegisterEmail(e.target.value)} placeholder="Your email" />
                  {/* <Input id="signupUsername" className="form-input" placeholder="Your username" /> */}
                  <Input.Password id="signupPassword" className="form-input" onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Password" />
                  {/* <Input.Password id="confirmPassword" className="form-input" placeholder="Confirm Password" /> */}
                  {/* <Link to='/dashboard'> */}
                  <Button type="primary" className="form-button" onClick={registerUser}>
                    Sign up
                  </Button>
                  {/* </Link> */}
                </form>
              </>
            )}
          </div>
        </Card>
      </Content>
    </Layout>
  )
}

export default Login