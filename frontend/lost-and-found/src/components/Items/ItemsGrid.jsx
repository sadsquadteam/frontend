// src/components/Items/ItemsGrid.jsx
import React, { useEffect, useState } from 'react';
import ItemCard from './ItemCard';
import '../../styles/items.css';
import { itemsAPI } from '../../services/api';

const ItemsGrid = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadItems = async () => {
      setError('');
      setLoading(true);
      try {
        const data = await itemsAPI.getAllItems(); // GET /api/items/
        setItems(data.results || data);           // handle paginated or plain list
      } catch (err) {
        setError(err.message || 'Failed to load items.');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  if (loading) {
    return <div className="items-grid-container">Loading items...</div>;
  }

  if (error) {
    return <div className="items-grid-container error-message">{error}</div>;
  }

  return (
    <div className="items-grid-container">
      <div className="items-header">
        <h1 className="items-title">Items Management</h1>
      </div>

      <div className="items-grid">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ItemsGrid;
