import React from 'react';
import { useNavigate } from 'react-router-dom';
import ItemCard from './ItemCard';
import '../../styles/items.css';

// Sample data - replace with your actual data source
const sampleItems = [
  { id: 1, title: 'JavaScript', description: 'JavaScript programming concepts and examples', icon: 'fab fa-js-square', category: 'JS' },
  { id: 2, title: 'React', description: 'React components and hooks tutorials', icon: 'fab fa-react', category: 'React' },
  { id: 3, title: 'Node.js', description: 'Backend development with Node.js', icon: 'fab fa-node-js', category: 'Node' },
  { id: 4, title: 'CSS3', description: 'Modern CSS techniques and animations', icon: 'fab fa-css3-alt', category: 'CSS' },
  { id: 5, title: 'HTML5', description: 'Semantic HTML and web standards', icon: 'fab fa-html5', category: 'HTML' },
  { id: 6, title: 'Python', description: 'Python programming and data science', icon: 'fab fa-python', category: 'Python' },
  { id: 7, title: 'Database', description: 'Database design and management', icon: 'fas fa-database', category: 'DB' },
  { id: 8, title: 'API', description: 'REST API design and development', icon: 'fas fa-server', category: 'API' },
  { id: 9, title: 'Mobile', description: 'Mobile app development', icon: 'fas fa-mobile-alt', category: 'Mobile' },
  { id: 10, title: 'Cloud', description: 'Cloud services and deployment', icon: 'fas fa-cloud', category: 'Cloud' },
  { id: 11, title: 'Security', description: 'Web security best practices', icon: 'fas fa-shield-alt', category: 'Security' },
  { id: 12, title: 'DevOps', description: 'Development and operations', icon: 'fas fa-code-branch', category: 'DevOps' },
];

const ItemsGrid = () => {
  const navigate = useNavigate();
  
  const handleAddNewItem = () => {
    navigate('/register'); // Or create a separate add item page
  };
  
  return (
    <div className="items-container">
      <div className="items-header">
        <h1 className="items-title">All Items</h1>
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