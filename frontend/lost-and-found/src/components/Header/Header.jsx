import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../UI';
import './Header.css';

const Header = ({ 
  title = "Lost&Found",
  isAuthenticated = false, 
  user = null 
}) => {
  const navigate = useNavigate();

  if (title === "Add New Item") {
    return <header className="header" />;
  }

  /* ===== GUEST HEADER ===== */
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
    navigate('/add-item', { state: { user } });
  };

  return (
    <header className="header">
      <Button variant="accent" onClick={handleAddNewClick}>
        Add new item
      </Button>
    </header>
  );
};

export default Header;
