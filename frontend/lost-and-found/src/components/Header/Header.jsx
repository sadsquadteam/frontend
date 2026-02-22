import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from '../../assets/images/Search.svg';
import './Header.css';

const Header = ({ 
  title = "Lost&Found",
  isAuthenticated = false, 
  user = null,
  onSearch
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  if (title === "Add New Item") {
    return <header className="header" />;
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch && onSearch(value);
  };

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

  return (
    <header className="header">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleChange}
        />
        <img src={Search} alt="search" />
      </div>
    </header>
  );
};

export default Header;