import './App.css'
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import HomePage from './pages/HomePage';
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage";

const App: React.FC = () => {

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/game/:roomId" element={<GamePage />} />
      </Routes>
    </div>
  );
}

export default App
