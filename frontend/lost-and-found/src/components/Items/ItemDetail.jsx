import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/items.css';

// Sample data - replace with your actual data source
const sampleItems = [
  { id: 1, title: 'JavaScript', description: 'JavaScript programming concepts and examples', 
    icon: 'fab fa-js-square', category: 'JS', 
    fullDescription: 'JavaScript is a versatile programming language used for web development. It allows you to create interactive websites and web applications.',
    details: {
      level: 'Intermediate',
      duration: '40 hours',
      projects: 5,
      lastUpdated: '2024-01-15'
    }
  },
  // Add more items...
];

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const item = sampleItems.find(item => item.id === parseInt(id));
  
  if (!item) {
    return (
      <div className="item-detail-container">
        <div className="item-not-found">
          <h2>Item not found</h2>
          <button onClick={() => navigate('/items')}>
            Back to Items
          </button>
        </div>
      </div>
    );
  }
  
  const cardColors = [
    { header: 'one', btn: 'one', colors: ['#f12711', '#f5af19'] },
    { header: 'two', btn: 'two', colors: ['#7F00FF', '#E100FF'] },
    { header: 'three', btn: 'three', colors: ['#3f2b96', '#a8c0ff'] },
    { header: 'four', btn: 'four', colors: ['#11998e', '#38ef7d'] },
  ];
  
  const colorIndex = item.id % 4;
  const colorClass = cardColors[colorIndex];
  
  return (
    <div className="item-detail-container">
      <button 
        className="back-button"
        onClick={() => navigate('/items')}
      >
        ← Back to Items
      </button>
      
      <div className="item-detail-content">
        <div className="item-detail-header">
          <div className={`item-detail-icon ${colorClass.header}`}>
            <i className={item.icon}></i>
          </div>
          <div className="item-detail-info">
            <h1>{item.title}</h1>
            <p className="item-category">{item.category}</p>
          </div>
        </div>
        
        <div className="item-detail-body">
          <div className="item-description">
            <h3>Description</h3>
            <p>{item.fullDescription || item.description}</p>
          </div>
          
          <div className="item-details-grid">
            <div className="detail-card">
              <h4>Level</h4>
              <p>{item.details?.level || 'Not specified'}</p>
            </div>
            <div className="detail-card">
              <h4>Duration</h4>
              <p>{item.details?.duration || 'Not specified'}</p>
            </div>
            <div className="detail-card">
              <h4>Projects</h4>
              <p>{item.details?.projects || '0'}</p>
            </div>
            <div className="detail-card">
              <h4>Last Updated</h4>
              <p>{item.details?.lastUpdated || 'Not specified'}</p>
            </div>
          </div>
          
          <div className="item-actions">
            <button className="action-btn primary">
              <i className="fas fa-edit"></i> Edit Item
            </button>
            <button className="action-btn secondary">
              <i className="fas fa-trash"></i> Delete Item
            </button>
            <button className="action-btn outline">
              <i className="fas fa-share"></i> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;