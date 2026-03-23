import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import OrganicReactions from './pages/OrganicReactions';
import InorganicReactions from './pages/InorganicReactions';
import CustomReactions from './pages/CustomReactions';
import PeriodicTablePage from './pages/PeriodicTablePage';
import ReactionDetail from './pages/ReactionDetail';
import AuthPage from './components/Auth/AuthPage';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#e2e8f0',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
              },
            }}
          />
          
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Header />
                  <div className="main-content">
                    <Sidebar />
                    <div className="content">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/organic" element={<OrganicReactions />} />
                        <Route path="/inorganic" element={<InorganicReactions />} />
                        <Route path="/custom" element={<CustomReactions />} />
                        <Route path="/periodic-table" element={<PeriodicTablePage />} />
                        <Route path="/reaction/:id" element={<ReactionDetail />} />
                      </Routes>
                    </div>
                  </div>
                  <Footer />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;