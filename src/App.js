import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from './Components/Authorization/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import UserProfile from './Components/Dashboard/UserProfile';
import UserSetting from './Components/Dashboard/UserSetting';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/usersetting" element={<UserSetting />} />
      </Routes>
    </Router>

  );
}

export default App;
