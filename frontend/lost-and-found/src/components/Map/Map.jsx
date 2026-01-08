// import React from 'react';
// import { MapContainer, TileLayer } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// // import search from '../../assets/images/Search.svg'; 
// // import filter from '../../assets/images/Filter.svg';

// const SimpleMap = () => {
//   const sharifCenter = [35.7036, 51.3515];

//   const bounds = [
//     [35.698, 51.340],
//     [35.710, 51.365],
//   ];

//   return (
//     <div className="map-wrapper">

//       {/* <div className="map-toolbar">
//         <div className="search-box">
//           <input type="text" placeholder="Search" />
//           <img src={search} alt="Search" />
//         </div>

//         <button className="filter-btn">
//           Filter by
//           <img src={filter} alt="Filter" />
//         </button>
//       </div> */}

//       <MapContainer
//         center={sharifCenter}
//         zoom={17}
//         scrollWheelZoom
//         keyboard={false}
//         maxBounds={bounds}
//         maxBoundsViscosity={1.0}
//         minZoom={17}
//         maxZoom={18}
//         className="leaflet-container"
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution="&copy; OpenStreetMap contributors"
//         />
//       </MapContainer>
//     </div>
//   );
// };

// export default SimpleMap;


import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import AddItemForm from '../Items/AddItemForm';
import { itemsAPI } from '../../services/api';
import { MAP_CONSTANTS, getMarkerIcon } from './mapUtils';
import { useHoldToAddMarker } from './useHoldToAddMarker';

const SimpleMap = () => {
  const [markers, setMarkers] = useState([]);
  
  // Use custom hook for hold-to-add functionality
  const {
    holdProgress,
    pendingMarkerPosition,
    showAddItemModal,
    startHold,
    cancelHold,
    handleModalClose,
    handleItemCreated: handleItemCreatedFromHook,
    cleanup
  } = useHoldToAddMarker();

  // Event handlers
  const handleMapMouseDown = (e) => {
    const { lat, lng } = e.latlng;
    startHold(lat, lng);
  };

  const handleItemCreated = (itemData) => {
    handleItemCreatedFromHook(itemData, markers, setMarkers);
  };

  const removeMarker = (id) => {
    setMarkers(prevMarkers => prevMarkers.filter(marker => marker.id !== id));
  };

  const clearAllMarkers = () => {
    setMarkers([]);
  };

  // Load existing items from API
  useEffect(() => {
    const loadExistingItems = async () => {
      try {
        const data = await itemsAPI.getAllItems();
        const items = data.results || data || [];
        
        const apiMarkers = items.map(item => ({
          id: item.id,
          position: [item.latitude, item.longitude],
          title: item.title,
          description: item.description,
          status: item.status,
          timestamp: item.created_at || new Date().toLocaleTimeString()
        }));
        
        setMarkers(apiMarkers);
      } catch (error) {
        console.error('Failed to load existing items:', error);
      }
    };

    loadExistingItems();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div className="map-wrapper" style={{ position: 'relative' }}>
      <MapContainer
        center={MAP_CONSTANTS.sharifCenter}
        zoom={17}
        scrollWheelZoom
        keyboard={false}
        maxBounds={MAP_CONSTANTS.bounds}
        maxBoundsViscosity={1.0}
        minZoom={17}
        maxZoom={18}
        className="leaflet-container"
        whenReady={(map) => {
          const leafletMap = map.target;
          
          leafletMap.on('mousedown', handleMapMouseDown);
          leafletMap.on('mouseup', cancelHold);
          leafletMap.on('mouseleave', cancelHold);
          
          return () => {
            leafletMap.off('mousedown', handleMapMouseDown);
            leafletMap.off('mouseup', cancelHold);
            leafletMap.off('mouseleave', cancelHold);
          };
        }}
      >
        <TileLayer
          url={MAP_CONSTANTS.tileLayer.url}
          attribution={MAP_CONSTANTS.tileLayer.attribution}
        />
        
        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={marker.position}
            icon={getMarkerIcon(marker.status)}
          >
            <Popup>
              <MarkerPopup 
                marker={marker} 
                onRemove={() => removeMarker(marker.id)}
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Progress indicator */}
      {holdProgress > 0 && holdProgress < 100 && (
        <HoldProgressIndicator progress={holdProgress} />
      )}
      
      {/* Instructions panel */}
      <InstructionsPanel markersCount={markers.length} />
      
      {/* Clear all button */}
      {markers.length > 0 && (
        <ClearAllButton 
          markersCount={markers.length} 
          onClear={clearAllMarkers} 
        />
      )}
      
      {/* Add item modal */}
      {showAddItemModal && pendingMarkerPosition && (
        <AddItemModal
          position={pendingMarkerPosition}
          onItemCreated={handleItemCreated}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

// Helper components
const MarkerPopup = ({ marker, onRemove }) => (
  <div>
    <strong>{marker.title}</strong>
    <br />
    Status: <span style={{
      color: marker.status === 'found' ? 'blue' : 
             marker.status === 'lost' ? 'red' : 
             marker.status === 'delivered' ? 'green' : 'gray',
      fontWeight: 'bold'
    }}>
      {marker.status}
    </span>
    <br />
    {marker.description}
    <br />
    <small>Added at: {marker.timestamp}</small>
    <br />
    <button 
      onClick={onRemove}
      style={{
        marginTop: '8px',
        padding: '4px 8px',
        backgroundColor: '#ff4444',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer'
      }}
    >
      Remove
    </button>
  </div>
);

const HoldProgressIndicator = ({ progress }) => (
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

const InstructionsPanel = ({ markersCount }) => (
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

const ClearAllButton = ({ markersCount, onClear }) => (
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

const AddItemModal = ({ position, onItemCreated, onClose }) => (
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

export default SimpleMap;