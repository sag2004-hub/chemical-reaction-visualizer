import React from 'react'; // Add this import
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'
import Footer from './components/Layout/Footer'
import Home from './pages/Home'
import OrganicReactions from './pages/OrganicReactions'
import InorganicReactions from './pages/InorganicReactions'
import CustomReactions from './pages/CustomReactions'
import PeriodicTablePage from './pages/PeriodicTablePage'
import ReactionDetail from './pages/ReactionDetail'
import './styles/globals.css'

function App() {
  return (
    <Router>
      <div className="app">
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
      </div>
    </Router>
  )
}

export default App