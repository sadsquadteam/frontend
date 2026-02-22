import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Location from '../../assets/images/Location.svg';
import FilterIcon from '../../assets/images/Filter.svg';
import Category from '../../assets/images/Category.svg';
import FilterItemForm from '../Items/FilterItemForm';

const SidebarNav = ({ isAuthenticated = false, user = null, onApplyFilter }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const navItems = [
    {
      icon: Location,
      path: '/dashboard',
      active:
        location.pathname === '/' ||
        location.pathname === '/dashboard',
      tooltip: 'Map',
      authRequired: false,
      action: 'navigate',
    },
    {
      icon: Category,
      path: '/items',
      active: location.pathname.startsWith('/items'),
      tooltip: 'Items',
      authRequired: false,
      action: 'navigate',
    },
    {
      icon: FilterIcon,
      tooltip: 'Filter',
      authRequired: true,
      action: 'modal',
    },
  ];

  const handleClick = (item) => {
    if (item.action === 'modal') {
      setIsFilterOpen(true);
    } else {
      navigate(item.path, { state: { user } });
    }
  };

  return (
    <>
      <nav className="sidebar-nav">
        {navItems
          .filter(item => !item.authRequired || isAuthenticated)
          .map((item, index) => (
            <button
              key={index}
              className={`sidebar-nav__item ${item.active ? 'active' : ''}`}
              onClick={() => handleClick(item)}
              title={item.tooltip}
            >
              <img src={item.icon} alt={item.tooltip} />
            </button>
          ))}
      </nav>

      <FilterItemForm
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(filters) => {
          onApplyFilter(filters);
        }}
      />
    </>
  );
};

export default SidebarNav;
