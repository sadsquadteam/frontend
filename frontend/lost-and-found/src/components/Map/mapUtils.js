import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

import icon from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: shadow,
});

export const createCustomIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    iconRetinaUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

export const statusIcons = {
  found: createCustomIcon('blue'),
  lost: createCustomIcon('red'),
  delivered: createCustomIcon('green'),
  default: createCustomIcon('gold')
};

export const MAP_CONSTANTS = {
  sharifCenter: [35.7036, 51.3515],
  bounds: [
    [35.698, 51.340],
    [35.710, 51.365],
  ],
  tileLayer: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors"
  }
};

export const getMarkerIcon = (status, icons = statusIcons) => {
  return icons[status] || icons.default;
};

export const getCardColors = (id) => {
  const cardColors = [
    { header: 'one', colors: ['#f12711', '#f5af19'] },
    { header: 'two', colors: ['#7F00FF', '#E100FF'] },
    { header: 'three', colors: ['#3f2b96', '#a8c0ff'] },
    { header: 'four', colors: ['#11998e', '#38ef7d'] },
  ];
  const colorIndex = id % 4;
  return cardColors[colorIndex];
};