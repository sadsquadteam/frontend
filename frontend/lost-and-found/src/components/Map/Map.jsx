import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SimpleMap = () => {
  const sharifCenter = [35.7036, 51.3515];
  
  const bounds = [
    [35.698, 51.340], // Southwest coordinates
    [35.710, 51.365], // Northeast coordinates
  ];

  return (
    <div className="map-wrapper">
      <MapContainer
        center={sharifCenter}
        zoom={17}
        scrollWheelZoom={true}
        keyboard={false}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        minZoom={17}
        maxZoom={18}
        className="leaflet-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
      </MapContainer>
    </div>
  );
};

export default SimpleMap;