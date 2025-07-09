import React, { useState } from 'react';
import { Layout, Card, Button, Input, message, Spin } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Smartlogo from "../../Inspect/Smart-logo.png";
import './Login.scss'
import axios from 'axios';
import { useTranslation } from "react-i18next";
const { Content } = Layout;

function App() {
  const { t, i18n } = useTranslation('translation')
  const [loading, setLoading] = useState(false);
  const [activeForm, setActiveForm] = useState('login');
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
      message.error(t("Please enter your email and password"));
      setLoading(false);
    }
    else {
      axios.post(`${process.env.REACT_APP_BASE_API_URL}/login/`, loginPayload)
        .then(resp => {
          console.log("responce", resp)
          localStorage.setItem('accessToken', resp.data.access);
          localStorage.setItem('userinfo', resp.data?.is_superuser)
          localStorage.setItem('userid', resp.data?.company_id)
          setLoading(false);
          window.location.reload()
        })
        .catch(error => {
          if (error.response) {
            if (error.response.status === 404 || error.response.status === 500) {
              message.error(t("Failed: Something went wrong with the server."));
            } else {
              const responseData = error.response.data;
              let errorMessage = '';

              for (const prop in responseData) {
                if (responseData.hasOwnProperty(prop)) {
                  errorMessage = responseData[prop][0];
                  break;
                }
              }

              message.error(errorMessage);
            }
          } else if (error.request) {
            console.error("No response received from the server:", error.request);
            message.error(t("Failed: No response received from the server."));
          } else {
            console.error("Error setting up the request:", error.message);
            message.error(t("Failed: Error setting up the request."))
          }
          setLoading(false)
        })
    }
  };

  return (
    <Layout className='main-layout' style={{ width: '100%', height: '100vh' }}>
      {/* <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <Dropdown overlay={menu} trigger={['click']} >
          <Button type="primary" style={{ width: "100px" }}>
            {i18n.language === 'fr' ? 'French' : 'English'} <DownOutlined/>
          </Button>
        </Dropdown>
      </div> */}
      <Content className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card className="custom-card" style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <div className='custom-title'>
            <img src={Smartlogo} className='Smart-connect-logo' alt="" />
          </div>

          {/* <div className='tab-container'>
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
          </div> */}
          <div className="tab-content">
            {activeForm === 'login' ? (
              <>
                <h1 className="section-title">{t('Welcome')}</h1>
                <p className='section-pera'>{t('Sign in to continue')}</p>
                <form className="login-form">
                  <Input id="loginemail" className="form-input" placeholder={t("Enter your email or username")} onChange={(e) => setEmail(e.target.value)} required />
                  <Input.Password id="loginPassword" className="form-input" placeholder={t('Password')} onChange={(e) => setPassword(e.target.value)} required />
                  <Link className='forget-password-link' to={'/forgetpassword'}>{t('Forgot Password')}?</Link>
                  <Button type="primary" className="form-button" onClick={loginUser}>
                    {loading ? <Spin /> : t("Login")}
                  </Button>
                </form>
              </>
            ) : (
              <>
                {/* <p className="section-title">Create Account</p>
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
                  <Input id="Company" className="form-input" placeholder="Company" onChange={(e) => setCompany(e.target.value)} />
                  <Input.Password id="signupPassword" className="form-input" onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Password" />
                  <Button type="primary" className="form-button" onClick={registerUser}>
                    {loading ? <Spin /> : "Sign up"}
                  </Button>
                </form> */}
              </>
            )}
          </div>
        </Card>
      </Content>
    </Layout>
  );
}

export default App;