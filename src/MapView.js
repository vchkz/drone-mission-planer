import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapView({ points, onAddPoint, onUpdatePoint, onRemovePoint }) {
  const [addPointEnabled, setAddPointEnabled] = useState(true);

  const AddPointOnClick = () => {
    useMapEvents({
      click(e) {
        if (addPointEnabled) {
          const newPoint = [e.latlng.lat, e.latlng.lng];
          onAddPoint(newPoint);
        }
        setAddPointEnabled(true);
      },
    });
    return null;
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[55.7558, 37.6173]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <AddPointOnClick />

        {points.map((point, idx) => (
          <Marker
            key={idx}
            position={point.position}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng();
                onUpdatePoint(idx, [lat, lng]);
              },
            }}
          >
            <Popup>
              <div>
                <p>Высота: {point.altitude} м</p>
                <button onClick={() => onRemovePoint(idx)}>Удалить маркер</button>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {points.length > 1 && <Polyline positions={points.map(point => point.position)} color="blue" />}
      </MapContainer>
    </div>
  );
}

export default MapView;
