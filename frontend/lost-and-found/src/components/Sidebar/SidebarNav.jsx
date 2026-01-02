import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ICONS } from '../../styles/icons';

const SidebarNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { 
      icon: ICONS.HOUSE, 
      active: location.pathname === '/dashboard',
      onClick: () => navigate('/dashboard'),
      tooltip: 'Dashboard'
    },
    { 
      icon: ICONS.CHART,
      active: location.pathname === '/analytics',
      onClick: () => navigate('/analytics'),
      tooltip: 'Analytics'
    },
    { 
      icon: ICONS.USERS,
      active: location.pathname === '/items' || location.pathname.startsWith('/items/'),
      onClick: () => navigate('/items'),
      tooltip: 'Items'
    },
    { 
      icon: ICONS.LAYERS,
      active: location.pathname === '/layers',
      onClick: () => navigate('/layers'),
      tooltip: 'Layers'
    },
    { 
      icon: ICONS.GEAR,
      active: location.pathname === '/settings',
      onClick: () => navigate('/settings'),
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