import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          💼 Reimbursement System
        </Link>
        <ul className="navbar-nav">
          <li>
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/forms/new" className={`nav-link ${isActive('/forms/new')}`}>
              New Form
            </Link>
          </li>
          <li>
            <Link to="/forms" className={`nav-link ${isActive('/forms')}`}>
              My Forms
            </Link>
          </li>
          <li>
            <Link to="/review" className={`nav-link ${isActive('/review')}`}>
              Review Forms
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;