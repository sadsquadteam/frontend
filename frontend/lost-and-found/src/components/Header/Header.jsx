import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { Button } from '../UI';
import { ICONS } from '../../styles/icons';

const Header = ({ title = "Lost&Found", children }) => {
  const navigate = useNavigate();
  const SlidersIcon = ICONS.SLIDERS;
  const PlusIcon = ICONS.PLUS;
  
  const handleAddNewClick = () => {
    navigate('/register');
  };
  
  const handleCustomizeClick = () => {
    console.log('Customize clicked');
  };

  let headerContent;
  
  // Check if children (image) is provided, otherwise use title
  if (children) {
    headerContent = <div className="logo-container">{children}</div>;
  } else {
    headerContent = <h1>{title}</h1>;
  }

  return (
    <header className="header">
      {headerContent} {/* Render either logo or title */}
      
      <div className="spacer" />
      
      <SearchBar />
      
      <Button icon={SlidersIcon} onClick={handleCustomizeClick}>
        Customize
      </Button>
      
      <Button variant="accent" icon={PlusIcon} onClick={handleAddNewClick}>
        Add New
      </Button>
    </header>
  );
};

export default Header;
