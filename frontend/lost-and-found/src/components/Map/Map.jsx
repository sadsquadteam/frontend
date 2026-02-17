import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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

// Custom component to handle geolocation
const LocationMarker = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const successHandler = (pos) => {
      const { latitude, longitude } = pos.coords;
      const userPosition = [latitude, longitude];
      setPosition(userPosition);
    };

    const errorHandler = (err) => {
      setError(`Error getting location: ${err.message}`);
      console.error(err);
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });

    const watchId = navigator.geolocation.watchPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [map]);

  return position === null ? null : (
    <Marker 
      position={position}
      icon={L.divIcon({
        html: '<div style="background-color: #4285F4; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
        className: 'user-location-marker',
        iconSize: [26, 26],
        popupAnchor: [0, -13]
      })}
    >
    </Marker>
  );
};

const SimpleMap = ({ searchQuery = "", user }) => {
  const [markers, setMarkers] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [locationStatus, setLocationStatus] = useState('loading'); // 'loading', 'success', 'error'
  
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

  // Check geolocation availability on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      console.log('Geolocation is not supported');
    } else {
      // Just test if geolocation works
      navigator.geolocation.getCurrentPosition(
        () => setLocationStatus('success'),
        () => setLocationStatus('error'),
        { timeout: 3000 }
      );
    }
  }, []);

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
        const data = await itemsAPI.getAllItems({ search: searchQuery });
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
        console.error('Failed to load items:', error);
      }
    };

    loadExistingItems();
  }, [searchQuery]);

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
        // maxBounds={MAP_CONSTANTS.bounds}
        maxBoundsViscosity={1.0}
        // minZoom={17}
        // maxZoom={18}
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
          crossOrigin={true} 
        />
        
        {/* Add the location marker component */}
        <LocationMarker />
        
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