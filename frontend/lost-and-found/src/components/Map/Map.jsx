import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// import search from '../../assets/images/Search.svg'; 
// import filter from '../../assets/images/Filter.svg';

const SimpleMap = () => {
  const sharifCenter = [35.7036, 51.3515];

  const bounds = [
    [35.698, 51.340],
    [35.710, 51.365],
  ];

  return (
    <div className="map-wrapper">

      {/* <div className="map-toolbar">
        <div className="search-box">
          <input type="text" placeholder="Search" />
          <img src={search} alt="Search" />
        </div>

        <button className="filter-btn">
          Filter by
          <img src={filter} alt="Filter" />
        </button>
      </div> */}

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
