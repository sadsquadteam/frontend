import React from 'react';
import SidebarNav from './SidebarNav';
import logo from '../../assets/images/Logo-icon.svg'; 
import logoText from '../../assets/images/logo-text.svg';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src={logo} alt="Logo" />
        <img src={logoText} alt="Logo Text" />
      </div>
      <SidebarNav />
      <div className="avatar" />
    </aside>
  );
};

export default Sidebar;
