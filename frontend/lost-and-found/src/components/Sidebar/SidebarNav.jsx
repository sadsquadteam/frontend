import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ICONS } from '../../styles/icons';

const SidebarNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';
  const isItems = location.pathname === '/items' || location.pathname.startsWith('/items/');
  
  const navItems = [
    { 
      icon: ICONS.HOUSE, 
      active: isDashboard,
      onClick: () => navigate('/dashboard'),
      tooltip: 'Dashboard'
    },
    { 
      icon: ICONS.CHART,
      active: false,
      onClick: () => console.log('Analytics clicked'),
      tooltip: 'Analytics'
    },
    { 
      icon: ICONS.USERS,
      active: isItems,
      onClick: () => navigate('/items'),
      tooltip: 'Items'
    },
    { 
      icon: ICONS.LAYERS,
      active: false,
      onClick: () => console.log('Layers clicked'),
      tooltip: 'Layers'
    },
    { 
      icon: ICONS.GEAR,
      active: false,
      onClick: () => console.log('Settings clicked'),
      tooltip: 'Settings'
    },
  ];

  return (
    <nav className="sidebar-nav">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Icon 
            key={index}
            className={item.active ? 'active' : ''}
            onClick={item.onClick}
            title={item.tooltip}
          />
        );
      })}
    </nav>
  );
};

export default SidebarNav;