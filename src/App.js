import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import NotFound from './pages/NotFound/NotFound';
import './App.css';

function App() {
  return (
    <div className="app">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <main className="container">
                  <Dashboard />
                </main>
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <main className="container">
                  <Profile />
                </main>
              </>
            </ProtectedRoute>
          }
        />

        {/* Redirect /dashboard to / */}
        <Route path="/dashboard" element={<Navigate to="/" replace />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
