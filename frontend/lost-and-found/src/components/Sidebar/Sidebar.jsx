import React from 'react';
import SidebarNav from './SidebarNav';
import logo from '../../assets/images/Logo-icon.svg';  // Adjust the path to your logo.svg file

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src={logo} alt="Logo" /> {/* Display the logo icon */}
      </div>
      <SidebarNav />
      <div className="avatar" />
    </aside>
  );
};

export default Sidebar;
