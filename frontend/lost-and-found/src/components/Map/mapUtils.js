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

// Helper function to count markers by status in a cluster
const countMarkersByStatus = (cluster) => {
  const markers = cluster.getAllChildMarkers();
  let lost = 0;
  let found = 0;
  let delivered = 0;
  let other = 0;

  markers.forEach(marker => {
    const status = marker.options?.status || 'default';

    if (status === 'lost') {
      lost++;
    } else if (status === 'found') {
      found++;
    } else if (status === 'delivered') {
      delivered++;
    } else {
      other++;
    }
  });

  return { lost, found, delivered, other, total: markers.length };
};

// Custom cluster icon
export const createClusterCustomIcon = (cluster) => {
  const { lost, found, delivered, other, total } = countMarkersByStatus(cluster);

  let width = '40px';
  let height = '40px';
  let fontSize = '14px';

  if (total >= 100) {
    width = '60px';
    height = '60px';
    fontSize = '18px';
  } else if (total >= 50) {
    width = '55px';
    height = '55px';
    fontSize = '16px';
  } else if (total >= 20) {
    width = '48px';
    height = '48px';
    fontSize = '15px';
  } else if (total >= 10) {
    width = '44px';
    height = '44px';
    fontSize = '14px';
  }

  let borderStyle = '';

  if (lost > 0 && found === 0 && delivered === 0 && other === 0) {
    // All lost - solid red border
    borderStyle = `3px solid #ff4444`;
  } else if (found > 0 && lost === 0 && delivered === 0 && other === 0) {
    // All found - solid blue border
    borderStyle = `3px solid #4285F4`;
  } else if (delivered > 0 && lost === 0 && found === 0 && other === 0) {
    borderStyle = `3px solid #00C851`;
  } else if (other > 0 && lost === 0 && found === 0 && delivered === 0) {
    borderStyle = `3px solid #ffbb33`;
  } else {

    const segments = [];
    let startAngle = 0;

    if (lost > 0) {
      const percentage = (lost / total) * 360;
      segments.push(`#ff4444 ${startAngle}deg ${startAngle + percentage}deg`);
      startAngle += percentage;
    }
    if (found > 0) {
      const percentage = (found / total) * 360;
      segments.push(`#4285F4 ${startAngle}deg ${startAngle + percentage}deg`);
      startAngle += percentage;
    }
    if (delivered > 0) {
      const percentage = (delivered / total) * 360;
      segments.push(`#00C851 ${startAngle}deg ${startAngle + percentage}deg`);
      startAngle += percentage;
    }
    if (other > 0) {
      const percentage = (other / total) * 360;
      segments.push(`#ffbb33 ${startAngle}deg ${startAngle + percentage}deg`);
    }

    borderStyle = `3px solid transparent; background: conic-gradient(${segments.join(', ')});`;
  }

  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: ${width};
        height: ${height};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <!-- Outer colored border -->
        <div style="
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          border-radius: 50%;
          ${borderStyle.includes('conic-gradient') ? borderStyle : `border: ${borderStyle}; background: transparent;`}
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        "></div>
        
        <!-- Inner white circle -->
        <div style="
          position: absolute;
          top: 3px;
          left: 3px;
          right: 3px;
          bottom: 3px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
        ">
          <span style="
            font-weight: bold;
            font-size: ${fontSize};
            color: #333;
          ">
            ${total}
          </span>
        </div>
      </div>
    `,
    className: 'custom-cluster-icon',
    iconSize: [parseInt(width) + 6, parseInt(height) + 6],
    iconAnchor: [(parseInt(width) + 6) / 2, (parseInt(height) + 6) / 2],
    popupAnchor: [0, -(parseInt(height) + 6) / 2]
  });
};

export const ClusterLegend = () => {
  const legendStyle = {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    zIndex: 1000,
    backgroundColor: 'white',
    padding: '12px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    fontSize: '12px',
    pointerEvents: 'none'
  };

  return (
    '<div style="' +
    'position: absolute; bottom: 20px; left: 20px; z-index: 1000; background-color: white; padding: 12px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); font-size: 12px; pointer-events: none;' +
    '">' +
    '<div style="font-weight: bold; margin-bottom: 8px;">Cluster Colors:</div>' +
    '<div style="display: flex; flex-direction: column; gap: 4px;">' +
    '<div style="display: flex; align-items: center; gap: 8px;">' +
    '<div style="width: 20px; height: 20px; border-radius: 50%; border: 3px solid #ff4444; background: white;"></div>' +
    '<span>Lost items</span>' +
    '</div>' +
    '<div style="display: flex; align-items: center; gap: 8px;">' +
    '<div style="width: 20px; height: 20px; border-radius: 50%; border: 3px solid #4285F4; background: white;"></div>' +
    '<span>Found items</span>' +
    '</div>' +
    '<div style="display: flex; align-items: center; gap: 8px;">' +
    '<div style="width: 20px; height: 20px; border-radius: 50%; border: 3px solid #00C851; background: white;"></div>' +
    '<span>Delivered items</span>' +
    '</div>' +
    '<div style="display: flex; align-items: center; gap: 8px;">' +
    '<div style="width: 20px; height: 20px; border-radius: 50%; border: 3px solid #ffbb33; background: white;"></div>' +
    '<span>Other items</span>' +
    '</div>' +
    '</div>' +
    '</div>'
  );
};