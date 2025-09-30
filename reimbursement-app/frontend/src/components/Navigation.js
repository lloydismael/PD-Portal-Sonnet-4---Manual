import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '�', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { path: '/forms', label: 'My Forms', icon: '�', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { path: '/forms/new', label: 'Create Form', icon: '✨', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { path: '/review', label: 'Review Forms', icon: '🔍', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  ];

  return (
    <nav className="modern-nav animate-fade-in-up">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-icon">�</span>
          <span className="brand-text text-gradient">Reimbursement Portal</span>
        </Link>
        
        <div className="nav-links">
          {navItems.map((item, index) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              style={{ '--animation-delay': `${index * 0.1}s` }}
            >
              <span className="nav-icon" style={{ background: item.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {item.icon}
              </span>
              <span className="nav-text">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="nav-user">
          <div className="user-avatar">
            <span>👨‍💼</span>
          </div>
          <div className="user-info">
            <span className="user-name">John Doe</span>
            <small className="user-role">Employee</small>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;