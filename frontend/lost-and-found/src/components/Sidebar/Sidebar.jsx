import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNav from './SidebarNav';
import '../../styles/sidebar.css';
import logo from '../../assets/images/Logo-icon.svg'; 
import logoText from '../../assets/images/logo-text.svg';
import logOutIcon from '../../assets/images/logOut.svg';

const Sidebar = ({ isAuthenticated: propIsAuthenticated = false, user: propUser = null }) => {
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState(propUser);
  const [localIsAuthenticated, setLocalIsAuthenticated] = useState(propIsAuthenticated);

  useEffect(() => {
    // If props are not provided, check localStorage
    if (!propUser) {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setLocalUser(parsedUser);
          setLocalIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('user');
      }
    } else {
      // Use props if provided
      setLocalUser(propUser);
      setLocalIsAuthenticated(propIsAuthenticated);
    }
  }, [propUser, propIsAuthenticated]);

  const handleLogout = () => {
    // Clear user from localStorage
    localStorage.removeItem('user');
    
    // Reset local state
    setLocalUser(null);
    setLocalIsAuthenticated(false);
    
    // Navigate to dashboard (non-authenticated view)
    navigate('/dashboard', { replace: true });
    
    // Optional: Force refresh to update all components
    window.location.reload();
  };

  // Determine which authentication state to use
  const isAuthenticated = propIsAuthenticated || localIsAuthenticated;
  const user = propUser || localUser;

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src={logo} alt="Logo" />
        <img src={logoText} alt="Logo Text" />
      </div>
      
      <SidebarNav isAuthenticated={isAuthenticated} user={user} />
      
      {isAuthenticated && (
        <button
          className="logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          <img src={logOutIcon} alt="Logout" />
        </button>
      )}
    </aside>
  );
};

export default Sidebar;