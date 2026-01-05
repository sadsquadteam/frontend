import React from 'react';
import SidebarNav from './SidebarNav';
import logo from '../../assets/images/Logo-icon.svg'; 
import logoText from '../../assets/images/logo-text.svg';
import logOutIcon from '../../assets/images/logOut.svg';

const Sidebar = ({isAuthenticated = false, user = null, onLogout}) => {
    return (
      <aside className="sidebar">
        <div className="sidebar__logo">
          <img src={logo} alt="Logo" />
          <img src={logoText} alt="Logo Text" />
        </div>
        <SidebarNav isAuthenticated={!!user} user={user} />
        {isAuthenticated && (
          <button
            className="logout-button"
            onClick={onLogout}
            title="Logout"
          >
            <img src={logOutIcon} alt="Logout" />
          </button>
        )}
      </aside>
    );
};

export default Sidebar;