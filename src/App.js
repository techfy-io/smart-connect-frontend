import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/Authorization/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import UserProfile from './Components/Dashboard/UserProfile';
import UserSetting from './Components/Dashboard/UserSetting';
import ForgetPassword from './Components/Authorization/ForgetPassword';
import CompanyUsers from './Components/SuperAdmin/CompanyUsers';
import ResetPassword from './Components/Authorization/ResetPassword';
import Profie from './Components/Dashboard/Profie';
import Leads from './Components/Dashboard/Leads';

function App() {
  // Check if the user is logged in by reading from local storage
  const checkAccessToken = () => {
    return localStorage.getItem('accessToken') !== null;
  };

  // Initialize the isLoggedIn state with the value from local storage
  const [isLoggedIn, setIsLoggedIn] = useState(checkAccessToken());

  useEffect(() => {
    // Update the isLoggedIn state when the component mounts
    setIsLoggedIn(checkAccessToken());
  }, []);

  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <>
            {/* Routes accessible only when logged in */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usersetting" element={<UserSetting />} />
            <Route path="/companyuser" element={<CompanyUsers />} />
            <Route path="/leads" element={<Leads />} />
          </>
        ) : (
          <>
            {/* Routes accessible only when logged out */}
            <Route path="/" element={<Login />} />
          </>
        )}
        {/* Common routes accessible in both states */}
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/profile/:userId" element={<Profie />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />

      </Routes>
    </Router>
  );
}

export default App;
