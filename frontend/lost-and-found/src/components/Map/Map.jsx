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
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { itemsAPI } from '../../services/api';
import { MAP_CONSTANTS, getMarkerIcon } from './mapUtils';
import { useHoldToAddMarker } from './useHoldToAddMarker';
import {
  HoldProgressIndicator,
  InstructionsPanel,
  ClearAllButton,
  AddItemModal,
  SideMenu,
  FullScreenItemDetail
} from './MapComponents';

const SimpleMap = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
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

  const handleMapMouseDown = (e) => {
    const { lat, lng } = e.latlng;
    startHold(lat, lng);
  };

  const handleItemCreated = (itemData) => {
    handleItemCreatedFromHook(itemData, markers, setMarkers);
  };

  const handleMarkerClick = (marker) => {
    setSelectedItem(marker);
    setIsSideMenuOpen(true);
    setIsFullScreen(false);
  };

  const closeSideMenu = () => {
    setIsSideMenuOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  const openFullScreen = () => {
    setIsFullScreen(true);
    setIsSideMenuOpen(false);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  const clearAllMarkers = () => {
    setMarkers([]);
    closeSideMenu();
  };

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
          timestamp: item.created_at || new Date().toLocaleTimeString(),
          image: item.image,
          user: item.user,
          ...item
        }));
        
        setMarkers(apiMarkers);
      } catch (error) {
        console.error('Failed to load existing items:', error);
      }
    };

    loadExistingItems();
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return (
    <div className="map-wrapper" style={{ position: 'relative', height: '100vh', width: '100%' }}>
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
        style={{ height: '100%', width: '100%' }}
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
            eventHandlers={{ click: () => handleMarkerClick(marker) }}
          />
        ))}
      </MapContainer>
      
      {holdProgress > 0 && holdProgress < 100 && (
        <HoldProgressIndicator progress={holdProgress} />
      )}
      
      <InstructionsPanel markersCount={markers.length} />
      
      {markers.length > 0 && (
        <ClearAllButton markersCount={markers.length} onClear={clearAllMarkers} />
      )}
      
      {showAddItemModal && pendingMarkerPosition && (
        <AddItemModal
          position={pendingMarkerPosition}
          onItemCreated={handleItemCreated}
          onClose={handleModalClose}
        />
      )}

      <SideMenu 
        isOpen={isSideMenuOpen && !isFullScreen}
        onClose={closeSideMenu}
        item={selectedItem}
        onOpenFullScreen={openFullScreen}
      />

      {isFullScreen && selectedItem && (
        <FullScreenItemDetail 
          item={selectedItem}
          onClose={closeFullScreen}
        />
      )}
    </div>
  );
};

export default SimpleMap;