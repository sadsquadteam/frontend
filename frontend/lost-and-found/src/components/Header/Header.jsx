import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../UI';
import './Header.css';

const Header = ({ title = "Lost&Found", children, isAuthenticated = false, user = null }) => {
  const navigate = useNavigate();

  // Guest header (when not authenticated)
  if (!isAuthenticated) {
    return (
      <header className="header header--guest">
        <div className="header-right">
          <span
            className="signup-text"
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>

          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
        </div>
      </header>
    );
  }

  const handleAddNewClick = () => {
    navigate('/add-item',isAuthenticated, { state: { user } }); 
  };
  

  let headerContent;
  
  // Check if children (image) is provided, otherwise use title
  if (children) {
    headerContent = <div className="logo-container">{children}</div>;
  } else {
    headerContent = <h1>{title}</h1>;
  }

  return (
    <header className="header">
      
      <Button variant="accent" onClick={handleAddNewClick}>
        Add new item
      </Button>
      
    </header>
  );
};

export default Header;