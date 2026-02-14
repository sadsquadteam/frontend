import React from 'react';
import AddItemForm from '../Items/AddItemForm';
import { itemsAPI } from '../../services/api';
import { getCardColors } from './mapUtils';

// Progress Indicator Component
export const HoldProgressIndicator = ({ progress }) => (
  <div style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1000,
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    pointerEvents: 'none'
  }}>
    {Math.round(progress)}%
  </div>
);

// Instructions Panel Component
export const InstructionsPanel = ({ markersCount }) => (
  <div style={{
    position: 'absolute',
    top: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '8px 16px',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    zIndex: 1000,
    fontSize: '14px',
    pointerEvents: 'none',
    textAlign: 'center'
  }}>
    Hold any spot for 5 seconds to add an item
    <br />
    <small>Total items on map: {markersCount}</small>
    <br />
    <small style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '5px' }}>
      <span style={{ color: 'blue' }}>● Found</span>
      <span style={{ color: 'red' }}>● Lost</span>
      <span style={{ color: 'green' }}>● Delivered</span>
    </small>
  </div>
);

// Clear All Button Component
export const ClearAllButton = ({ markersCount, onClear }) => (
  <div style={{
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '10px 16px',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    zIndex: 1000,
    fontSize: '14px',
    display: 'flex',
    gap: '10px'
  }}>
    <button
      onClick={onClear}
      style={{
        padding: '6px 12px',
        backgroundColor: '#ff4444',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      Clear All Items ({markersCount})
    </button>
  </div>
);

// Add Item Modal Component
export const AddItemModal = ({ position, onItemCreated, onClose }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 2000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative'
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'none',
          border: 'none',
          fontSize: '20px',
          cursor: 'pointer',
          color: '#666'
        }}
      >
        ✕
      </button>
      
      <AddItemForm 
        isModal={true}
        coordinates={position}
        onItemCreated={onItemCreated}
        onCancel={onClose}
      />
    </div>
  </div>
);

// Side Menu Component
export const SideMenu = ({ isOpen, onClose, item, onOpenFullScreen }) => {
  if (!item) return null;

  const colorClass = getCardColors(item.id);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: isOpen ? 0 : '-450px',
      width: '420px',
      height: '100vh',
      backgroundColor: 'white',
      boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
      zIndex: 1500,
      transition: 'right 0.3s ease-in-out',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px',
        background: `linear-gradient(135deg, ${colorClass.colors[0]}, ${colorClass.colors[1]})`,
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            <i className="fas fa-box" />
          </div>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '600' }}>{item.title}</h2>
            <span style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              textTransform: 'uppercase'
            }}>
              {item.status}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '4px'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {/* Description */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>
            Description
          </h3>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', margin: 0 }}>
            {item.description || 'No description provided.'}
          </p>
        </div>

        {/* Details */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>
            Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Status</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{item.status}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Latitude</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{item.position[0].toFixed(6)}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Longitude</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{item.position[1].toFixed(6)}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Created at</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{item.timestamp || '—'}</div>
            </div>
          </div>
        </div>

        {/* Image */}
        {item.image && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#333' }}>
              Image
            </h3>
            <img 
              src={item.image} 
              alt={item.title}
              style={{
                width: '100%',
                maxHeight: '200px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginTop: 'auto',
          paddingTop: '16px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <button
            onClick={onOpenFullScreen}
            style={{
              flex: 1,
              padding: '12px',
              background: `linear-gradient(135deg, ${colorClass.colors[0]}, ${colorClass.colors[1]})`,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            <i className="fas fa-expand"></i> Open in Full Screen
          </button>
        </div>
      </div>
    </div>
  );
};

// Full Screen Item Detail Component
export const FullScreenItemDetail = ({ item, onClose }) => {
  const colorClass = getCardColors(item.id);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await itemsAPI.deleteItem(item.id);
        window.location.href = '/items';
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  };

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
        onClick={onClose}
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
      <div className="item-detail-content" style={{ padding: '40px 20px' }}>
        <div className="item-detail-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
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
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>{item.position[0].toFixed(6)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>Longitude</div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>{item.position[1].toFixed(6)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#999', marginBottom: '4px' }}>Created at</div>
                  <div style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>{item.timestamp || '—'}</div>
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
                onClick={() => window.location.href = `/items/${item.id}/edit`}
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