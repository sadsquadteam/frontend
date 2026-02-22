import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNav from './SidebarNav';
import '../../styles/sidebar.css';
import logo from '../../assets/images/Logo-icon.svg'; 
import logoText from '../../assets/images/logo-text.svg';
import logOutIcon from '../../assets/images/logOut.svg';
import { authAPI, tokenService } from '../../services/api'; 

const Sidebar = ({ isAuthenticated: propIsAuthenticated = false, user: propUser = null, onApplyFilter}) => {
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState(propUser);
  const [localIsAuthenticated, setLocalIsAuthenticated] = useState(propIsAuthenticated);

  useEffect(() => {
    if (!propUser) {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setLocalUser(parsedUser);
          setLocalIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('user');
      }
    } else {
      setLocalUser(propUser);
      setLocalIsAuthenticated(propIsAuthenticated);
    }
  }, [propUser, propIsAuthenticated]);

  const handleLogout = async () => {
    try {
      const accessToken = tokenService.getAccessToken();
      const refreshToken = tokenService.getRefreshToken();
      
      if (accessToken && refreshToken) {
        await authAPI.logout(refreshToken, accessToken);
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      tokenService.clearTokens();
      localStorage.removeItem('user');
      
      setLocalUser(null);
      setLocalIsAuthenticated(false);
      
      navigate('/dashboard', { replace: true });
      
      window.location.reload();
    }
  };

  const isAuthenticated = propIsAuthenticated || localIsAuthenticated;
  const user = propUser || localUser;

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src={logo} alt="Logo" />
        <img src={logoText} alt="Logo Text" />
      </div>
      
      <SidebarNav isAuthenticated={isAuthenticated} user={user} onApplyFilter={onApplyFilter}/>
      
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