import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import LoginPage from './components/LoginPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} />} />
        <Route path="/app" element={<LandingPage isAuthenticated={isAuthenticated} />} />
        <Route path="/dashboard" element={<LandingPage isAuthenticated={isAuthenticated} />} />

        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/app" replace />
              : <LoginPage onLoginSuccess={handleLoginSuccess} />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
