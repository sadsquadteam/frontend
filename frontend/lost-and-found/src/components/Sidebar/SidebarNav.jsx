import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Location from '../../assets/images/Location.svg'; 
import Category from '../../assets/images/Category.svg';
import Chatbot from '../../assets/images/Chatbot.svg';

const SidebarNav = ({ isAuthenticated = false , user = null}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: Location,
      path: '/dashboard',
      active: location.pathname === '/' || location.pathname === '/dashboard',
      tooltip: 'Map',
      authRequired: false,
    },
    {
      icon: Category,
      path: '/items',
      active: location.pathname.startsWith('/items'),
      tooltip: 'Items',
      authRequired: false,
    },
    {
      icon: Chatbot,
      path: '/chat',
      active: location.pathname === '/chat',
      tooltip: 'Chat',
      authRequired: true,
    },
  ];

  return (
    <nav className="sidebar-nav">
      {navItems
        .filter(item => !item.authRequired || isAuthenticated)
        .map((item, index) => (
          <button
            key={index}
            className={`sidebar-nav__item ${item.active ? 'active' : ''}`}
            onClick={() => navigate(item.path, { state: { user } })}
            title={item.tooltip}
          >
            <img src={item.icon} alt={item.tooltip} />
          </button>
        ))}
    </nav>
  );
};

export default SidebarNav;