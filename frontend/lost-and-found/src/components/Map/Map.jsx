import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SimpleMap = () => {
  const sharifCenter = [35.7036, 51.3515];

  const bounds = [
    [35.698, 51.340],
    [35.710, 51.365],
  ];

  return (
    <div className="map-wrapper">

      {/* 🔍 Search & Filter Overlay */}
      <div className="map-toolbar">
        <div className="search-box">
          <input type="text" placeholder="Search" />
          <span className="icon">🔍</span>
        </div>

        <button className="filter-btn">
          Filter by
          <span className="filter-icon">⚙️</span>
        </button>
      </div>

      <MapContainer
        center={sharifCenter}
        zoom={17}
        scrollWheelZoom
        keyboard={false}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        minZoom={17}
        maxZoom={18}
        className="leaflet-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
      </MapContainer>
    </div>
  );
};

export default SimpleMap;
