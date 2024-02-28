import React, { useState } from 'react';
import { Layout, Card, Button, Input } from 'antd';
import { Link } from 'react-router-dom';
import logo from "../../Inspect/logo.png";
import './Login.scss'
const { Content } = Layout;

const Login = () => {
  const [activeForm, setActiveForm] = useState('login');

  const handleTabChange = (formType) => {
    setActiveForm(formType);
  };

  return (
    <Layout className='main-layout'>
      <Content className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card className="custom-card">
          <div className='custom-title'>
            <img src={logo} className='logo' alt="" />
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
                  <Input id="loginUsername" className="form-input" placeholder="Enter your email or username" required />
                  <Input.Password id="loginPassword" className="form-input" placeholder="Password" required />
                  <Link to='/dashboard'>
                    <Button type="primary" htmlType="submit" className="form-button">
                      Continue
                    </Button>
                  </Link>
                </form>
              </>
            ) : (
              <>
                <p className="section-title">Create Account</p>
                <p className='section-pera'>Sign up to get started!</p>
                <form className="signup-form">
                  <Input type="email" id="signupEmail" className="form-input" placeholder="Your email" />
                  <Input id="signupUsername" className="form-input" placeholder="Your username" />
                  <Input id="Company" className="form-input" placeholder="Company" />
                  <Input.Password id="signupPassword" className="form-input" placeholder="Password" />
                  <Input.Password id="confirmPassword" className="form-input" placeholder="Confirm Password" />
                  <Link to='/dashboard'>
                    <Button type="primary" htmlType="submit" className="form-button">
                      Sign up
                    </Button>
                  </Link>
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