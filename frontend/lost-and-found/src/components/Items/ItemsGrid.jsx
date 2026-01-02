import React from 'react';
import { useNavigate } from 'react-router-dom';
import ItemCard from './ItemCard';
import '../../styles/items.css';

// Sample data
const sampleItems = [
  { id: 1, title: 'Item 1', description: 'Description for item 1', icon: 'fas fa-code', category: 'Code' },
  { id: 2, title: 'Item 2', description: 'Description for item 2', icon: 'fab fa-css3-alt', category: 'CSS' },
  { id: 3, title: 'Item 3', description: 'Description for item 3', icon: 'fab fa-html5', category: 'HTML' },
  { id: 4, title: 'Item 4', description: 'Description for item 4', icon: 'fab fa-js-square', category: 'JS' },
  { id: 5, title: 'Item 5', description: 'Description for item 5', icon: 'fas fa-box', category: 'Box' },
  { id: 6, title: 'Item 6', description: 'Description for item 6', icon: 'fas fa-cube', category: 'Cube' },
  { id: 7, title: 'Item 7', description: 'Description for item 7', icon: 'fas fa-database', category: 'DB' },
  { id: 8, title: 'Item 8', description: 'Description for item 8', icon: 'fas fa-server', category: 'Server' },
  { id: 9, title: 'Item 9', description: 'Description for item 9', icon: 'fas fa-cloud', category: 'Cloud' },
  { id: 10, title: 'Item 10', description: 'Description for item 10', icon: 'fas fa-mobile-alt', category: 'Mobile' },
  { id: 11, title: 'Item 11', description: 'Description for item 11', icon: 'fas fa-shield-alt', category: 'Security' },
  { id: 12, title: 'Item 12', description: 'Description for item 12', icon: 'fas fa-code-branch', category: 'DevOps' },
];

const ItemsGrid = () => {
  const navigate = useNavigate();
  
  const handleAddNewItem = () => {
    navigate('/register');
  };
  
  return (
    <div className="items-grid-container">
      <div className="items-header">
        <h1 className="items-title">Items Management</h1>
        <button 
          className="add-item-btn"
          onClick={handleAddNewItem}
        >
          <i className="fas fa-plus"></i> Add New Item
        </button>
      </div>
      
      <div className="items-grid">
        {sampleItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ItemsGrid;