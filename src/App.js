import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Authorization/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import UserSetting from './Components/Dashboard/UserSetting';
import ForgetPassword from './Components/Authorization/ForgetPassword';
import CompanyUsers from './Components/SuperAdmin/CompanyUsers';
import ResetPassword from './Components/Authorization/ResetPassword';
import Profie from './Components/Dashboard/Profie';
import Leads from './Components/Dashboard/Leads';
import ScrollToTop from './Components/Common/Scrolltop';
function App() {
  const checkAccessToken = () => {
    return localStorage.getItem('accessToken') !== null;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(checkAccessToken());

  useEffect(() => {
    setIsLoggedIn(checkAccessToken());
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {isLoggedIn ? (
          <>
            {/* 1logged in routs*/}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usersetting" element={<UserSetting />} />
            <Route path="/companyuser" element={<CompanyUsers />} />
            <Route path="/leads" element={<Leads />} />
          </>
        ) : (
          <>
            {/* 1logged in routs*/}
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Login />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/profile/:userId" element={<Profie />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
