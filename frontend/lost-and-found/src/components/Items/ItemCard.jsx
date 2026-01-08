// src/components/Items/ItemCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/card.css';

const ItemCard = ({ item }) => {
  const navigate = useNavigate();

  const cardColors = [
    { header: 'one', btn: 'one', colors: ['#f12711', '#f5af19'] },
    { header: 'two', btn: 'two', colors: ['#7F00FF', '#E100FF'] },
    { header: 'three', btn: 'three', colors: ['#3f2b96', '#a8c0ff'] },
    { header: 'four', btn: 'four', colors: ['#11998e', '#38ef7d'] },
  ];

  const colorIndex = item.id % 4;
  const colorClass = cardColors[colorIndex];

  const handleCardClick = () => {
    navigate(`/items/${item.id}`);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    console.log(`Button clicked for item: ${item.title}`);
  };

  // Backend already returns FULL absolute URL
  // e.g. "http://localhost:8000/media/items/unnamed.png"
  const imageUrl = item.image || null;
  
  console.log('Item image URL:', item.id, imageUrl); // debug

  return (
    <div className="card-wrap" onClick={handleCardClick}>
      <div className={`card-header ${colorClass.header}`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="card-image"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <i className={item.icon || 'fas fa-box'}></i>
        )}
      </div>
      <div className="card-content">
        <h1 className="card-title">{item.title}</h1>
        <p className="card-text">{item.description}</p>
        <button
          className={`card-btn ${colorClass.btn}`}
          onClick={handleButtonClick}
        >
          {item.category || 'View'}
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
