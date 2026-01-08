// src/components/Items/ItemDetail.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/items.css';
import { itemsAPI } from '../../services/api';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadItem = async () => {
      setError('');
      setLoading(true);
      try {
        const data = await itemsAPI.getItemById(id); // GET /api/items/:id/
        setItem(data);
      } catch (err) {
        setError(err.message || 'Failed to load item.');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await itemsAPI.deleteItem(id); // DELETE /api/items/:id/
      navigate('/items');
    } catch (err) {
      setError(err.message || 'Failed to delete item.');
    }
  };

  const handleEdit = () => {
    // Next step: navigate to an edit page or reuse AddItemForm in "edit" mode
    navigate(`/items/${id}/edit`);
  };

  if (loading) {
    return <div className="item-detail-content">Loading...</div>;
  }

  if (error) {
    return (
      <div className="item-detail-content">
        <div className="item-not-found">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

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
            <i className="fas fa-box" />
          </div>
          <div className="item-header-info">
            <h1>{item.title}</h1>
            <span className="item-category">{item.status}</span>
          </div>
        </div>

        <div className="item-detail-body">
          <div className="item-description-section">
            <h3>Description</h3>
            <p>{item.description}</p>
          </div>

          <div className="item-details-section">
            <h3>Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value">{item.status}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Latitude:</span>
                <span className="detail-value">{item.latitude}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Longitude:</span>
                <span className="detail-value">{item.longitude}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created at:</span>
                <span className="detail-value">
                  {item.created_at || '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="item-actions">
            <button className="action-btn primary" onClick={handleEdit}>
              <i className="fas fa-edit"></i> Edit
            </button>
            <button className="action-btn danger" onClick={handleDelete}>
              <i className="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
