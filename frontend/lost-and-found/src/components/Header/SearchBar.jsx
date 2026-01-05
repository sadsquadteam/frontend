import React from 'react';
import { ICONS } from '../../styles/icons';

const SearchBar = () => {
  const SearchIcon = ICONS.SEARCH;
  
  return (
    <div className="search">
      <input placeholder="Search..." />
      <SearchIcon />
    </div>
  );
};

export default SearchBar;