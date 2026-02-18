import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/items.css';
import { itemsAPI } from '../../services/api';

// Helper function to get card colors (matching the one in mapUtils)
const getCardColors = (id) => {
  const cardColors = [
    { header: 'one', colors: ['#f12711', '#f5af19'] },
    { header: 'two', colors: ['#7F00FF', '#E100FF'] },
    { header: 'three', colors: ['#3f2b96', '#a8c0ff'] },
    { header: 'four', colors: ['#11998e', '#38ef7d'] },
  ];
  const colorIndex = id % 4;
  return cardColors[colorIndex];
};

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

  const handleClose = () => {
    navigate('/items');
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>{error ? 'Error' : 'Item not found'}</h2>
          <p>{error || "The item you're looking for doesn't exist."}</p>
          <button
            onClick={handleClose}
            style={{
              padding: '10px 20px',
              background: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '16px'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const colorClass = getCardColors(item.id);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      zIndex: 2000,
      overflow: 'auto'
    }}>
      {/* Close button */}
      <button
        onClick={handleClose}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#ff4444',
          border: 'none',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer',
          padding: '10px 20px',
          borderRadius: '4px',
          zIndex: 2001,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
        onMouseEnter={(e) => e.target.style.background = '#ff6666'}
        onMouseLeave={(e) => e.target.style.background = '#ff4444'}
      >
        <i className="fas fa-times"></i> Close
      </button>
      
      {/* Item Detail Content */}
      <div style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{
            padding: '32px',
            background: `linear-gradient(135deg, ${colorClass.colors[0]}, ${colorClass.colors[1]})`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            borderRadius: '8px 8px 0 0'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px'
            }}>
              <i className="fas fa-box"></i>
            </div>
            <div>
              <h1 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>{item.title}</h1>
              <span style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '14px',
                textTransform: 'uppercase'
              }}>{item.status}</span>
            </div>
          </div>

          {/* Body */}
          <div style={{
            padding: '32px',
            backgroundColor: 'white',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {/* Description */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>
                Description
              </h3>
              <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#666', margin: 0 }}>
                {item.description || 'No description provided.'}
              </p>
            </div>

            {/* Details */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>
                Details
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>Status</div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>{item.status}</div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>Latitude</div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                    {item.latitude || (item.position && item.position[0])?.toFixed(6)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>Longitude</div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                    {item.longitude || (item.position && item.position[1])?.toFixed(6)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>Created at</div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>
                    {item.created_at || item.timestamp || '—'}
                  </div>
                </div>
              </div>
            </div>

            {/* Image */}
            {item.image && (
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#333' }}>
                  Image
                </h3>
                <img 
                  src={item.image} 
                  alt={item.title}
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                  }}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '16px',
              borderTop: '1px solid #e0e0e0',
              paddingTop: '24px'
            }}>
              <button 
                style={{
                  padding: '12px 24px',
                  background: `linear-gradient(135deg, ${colorClass.colors[0]}, ${colorClass.colors[1]})`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onClick={() => navigate(`/items/${item.id}/edit`)}
              >
                <i className="fas fa-edit"></i> Edit
              </button>
              <button 
                style={{
                  padding: '12px 24px',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onClick={handleDelete}
              >
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;