import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import CreateForm from './pages/CreateForm';
import MyForms from './pages/MyForms';
import ReviewForms from './pages/ReviewForms';
import './index.css';
import './modern-styles.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        
        <div className="container">
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/forms" element={<MyForms />} />
              <Route path="/forms/new" element={<CreateForm />} />
              <Route path="/review" element={<ReviewForms />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;