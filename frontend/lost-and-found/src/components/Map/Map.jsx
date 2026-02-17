import React, { useState, useEffect, useRef } from 'react';
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
const LocationMarker = ({ onLocationFound, userLocation }) => {
  const [position, setPosition] = useState(userLocation || null);
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
      if (onLocationFound) {
        onLocationFound(userPosition);
      }
    };

    const errorHandler = (err) => {
      setError(`Error getting location: ${err.message}`);
      console.error(err);
    };

    // Only get initial position if we don't already have one from props
    if (!userLocation) {
      navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    }

    const watchId = navigator.geolocation.watchPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [map, onLocationFound, userLocation]);

  return position === null ? null : (
    <Marker 
      position={position}
      icon={L.divIcon({
        html: '<div style="background-color: #4285F4; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
        className: 'user-location-marker',
        iconSize: [26, 26],
        popupAnchor: [0, -13]
      })}
    />
  );
};

// Custom component to handle map center updates
const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, map, zoom]);
  
  return null;
};

const SimpleMap = ({ searchQuery = "", user }) => {
  const [markers, setMarkers] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [locationStatus, setLocationStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  
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
        (pos) => {
          setLocationStatus('success');
          const { latitude, longitude } = pos.coords;
          setUserLocation([latitude, longitude]);
        },
        () => setLocationStatus('error'),
        { timeout: 3000 }
      );
    }
  }, []);

  const handleLocationFound = (position) => {
    setUserLocation(position);
    setLocationStatus('success');
  };

  const goToMyLocation = () => {
    if (userLocation) {
      setMapCenter(userLocation);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPosition = [latitude, longitude];
          setUserLocation(newPosition);
          setMapCenter(newPosition);
          setLocationStatus('success');
        },
        (err) => {
          setLocationStatus('error');
          console.error('Error getting location:', err);
          alert('Unable to get your location. Please check your location permissions.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }
  };

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
        center={mapCenter || MAP_CONSTANTS.sharifCenter}
        zoom={17}
        scrollWheelZoom
        keyboard={false}
        maxBoundsViscosity={1.0}
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
        <LocationMarker 
          onLocationFound={handleLocationFound}
          userLocation={userLocation}
        />
        
        {/* Map controller to handle programmatic center changes */}
        <MapController center={mapCenter} zoom={17} />
        
        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={marker.position}
            icon={getMarkerIcon(marker.status)}
            eventHandlers={{ click: () => handleMarkerClick(marker) }}
          />
        ))}
      </MapContainer>
      
      {/* Go to My Location Button */}
      <button
        onClick={goToMyLocation}
        style={{
          position: 'absolute',
          bottom: '100px',
          right: '10px',
          zIndex: 1000,
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px'
        }}
        title="Go to my location"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke={locationStatus === 'error' ? '#ff4444' : '#4285F4'} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="3" fill={locationStatus === 'error' ? '#ff4444' : '#4285F4'}/>
        </svg>
      </button>
      
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