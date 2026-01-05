import React from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/items.css';

const sampleItems = [
  { id: 1, title: 'Item 1', description: 'Description for item 1', 
    icon: 'fas fa-code', category: 'Code', 
    fullDescription: 'This is a detailed description of Item 1. It contains more information about the item, its features, and specifications.',
    details: {
      status: 'Active',
      created: '2024-01-15',
      updated: '2024-03-20',
      owner: 'John Doe'
    }
  },
  // Add more items...
];

const ItemDetail = () => {
  const { id } = useParams();
  
  const item = sampleItems.find(item => item.id === parseInt(id));
  
  if (!item) {
    return (
      <div className="item-detail-content">
        <div className="item-not-found">
          <h2>Item not found</h2>
          <p>The item you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  const cardColors = [
    { header: 'one', colors: ['#f12711', '#f5af19'] },
    { header: 'two', colors: ['#7F00FF', '#E100FF'] },
    { header: 'three', colors: ['#3f2b96', '#a8c0ff'] },
    { header: 'four', colors: ['#11998e', '#38ef7d'] },
  ];
  
  const colorIndex = item.id % 4;
  const colorClass = cardColors[colorIndex];
  
  return (
    <div className="item-detail-content">
      <div className="item-detail-card">
        <div className={`item-detail-header ${colorClass.header}`}>
          <div className="item-header-icon">
            <i className={item.icon}></i>
          </div>
          <div className="item-header-info">
            <h1>{item.title}</h1>
            <span className="item-category">{item.category}</span>
          </div>
        </div>
        
        <div className="item-detail-body">
          <div className="item-description-section">
            <h3>Description</h3>
            <p>{item.fullDescription || item.description}</p>
          </div>
          
          <div className="item-details-section">
            <h3>Details</h3>
            <div className="details-grid">
              {Object.entries(item.details || {}).map(([key, value]) => (
                <div key={key} className="detail-item">
                  <span className="detail-label">{key}:</span>
                  <span className="detail-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="item-actions">
            <button className="action-btn primary">
              <i className="fas fa-edit"></i> Edit
            </button>
            <button className="action-btn danger">
              <i className="fas fa-trash"></i> Delete
            </button>
            <button className="action-btn secondary">
              <i className="fas fa-share"></i> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;