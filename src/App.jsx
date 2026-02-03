import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Home from './components/Home';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';
import Projects from './components/Projects';
import Journey from './components/Journey';
import About from './components/About';
import ProjectIntro from './components/ProjectIntro';
import './App.css';

import Navbar from './components/Navbar';
import Contact from './components/Contact';

import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

import { usePortfolio } from './context/PortfolioContext';

function App() {
  const { profile, isLoading } = usePortfolio();
  const [showIntro, setShowIntro] = useState(false);
  const [isIntroChecked, setIsIntroChecked] = useState(false);

  useEffect(() => {
    // Wait for loading to finish before deciding
    if (!isLoading && !isIntroChecked) {
      const hasShownIntro = sessionStorage.getItem('hasShownIntro');

      // Show intro if:
      // 1. It's enabled in profile settings (default true)
      // 2. It hasn't been shown in this session yet
      if (profile?.showProjectIntro && !hasShownIntro) {
        setShowIntro(true);
      }

      setIsIntroChecked(true);
    }
  }, [isLoading, profile, isIntroChecked]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('hasShownIntro', 'true');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-500 animate-pulse font-mono">Loading System...</div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <ProjectIntro key="intro" onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {!showIntro && (
        <>
          <WhatsAppButton />
          <Router>
            <Routes>
              {/* Routes without Navbar */}
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              } />

              {/* Routes with Navbar and Footer */}
              <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
              <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
              <Route path="/projects" element={<><Navbar /><Projects /><Footer /></>} />
              <Route path="/journey" element={<><Navbar /><Journey /><Footer /></>} />
              <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </>
      )}
    </>
  );
}

function AppWrapper() {
  return (
    <PortfolioProvider>
      <App />
    </PortfolioProvider>
  );
}

export default AppWrapper;
// Updated App component
