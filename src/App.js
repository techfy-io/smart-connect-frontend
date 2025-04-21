import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Authorization/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import UserSetting from './Components/Dashboard/UserSetting';
import ForgetPassword from './Components/Authorization/ForgetPassword';
import CompanyUsers from './Components/SuperAdmin/CompanyUsers';
import ResetPassword from './Components/Authorization/ResetPassword';
import Profie from './Components/Dashboard/Profile';
import Leads from './Components/Dashboard/Leads';
import ScrollToTop from './Components/Common/Scrolltop';
import { Spin } from 'antd';

function App() {
  const [loading, setLoading] = useState(true);
  const [validUser, setValidUser] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setValidUser(true);
    } else {
      setValidUser(false);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Redirect based on authentication status */}
        <Route path="/" element={validUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        {/* Public routes */}
        <Route path="/login" element={validUser ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/forgetpassword" element={validUser ? <Navigate to="/dashboard" /> : <ForgetPassword />} />
        <Route path="/resetpassword" element={validUser ? <Navigate to="/dashboard" /> : <ResetPassword />} />
        <Route path="/profile/:companyId/:userId" element={<Profie />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={validUser ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/usersetting" element={validUser ? <UserSetting /> : <Navigate to="/login" />} />
        <Route path="/companyuser" element={validUser ? <CompanyUsers /> : <Navigate to="/login" />} />
        <Route path="/leads" element={validUser ? <Leads /> : <Navigate to="/login" />} />
        <Route path="/profile/:companyId/:userId" element={validUser ? <Profie /> : <Navigate to="/login" />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
