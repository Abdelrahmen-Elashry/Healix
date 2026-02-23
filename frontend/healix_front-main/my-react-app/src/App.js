import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Register';
import SignIn from './SignIn';
import ProfileCompletion from './ProfileCompletion';
import Dashboard from './Dashboard';
import Profile from './Profile';
import PatientRecords from './PatientRecords';
import NotificationContainer from './NotificationContainer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <NotificationContainer />
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/profile-completion" element={<ProfileCompletion />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/patient-records" element={<PatientRecords />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
