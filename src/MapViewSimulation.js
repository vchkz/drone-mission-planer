import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-rotatedmarker';
import 'leaflet/dist/leaflet.css';

const planeIcon = new L.Icon({
  iconUrl: '/plane_icon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function MovingMarker({ position, waypoints, yaw }) {
  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLatLng(position);  // обновляем позицию маркера
      markerRef.current.setRotationAngle(yaw);  // применяем угол yaw для вращения
    }
  }, [position, yaw]);

  return (
    <>
      <Marker
        position={position}
        icon={planeIcon}
        ref={markerRef}
        rotationOrigin="center"
      />
      {waypoints.length > 0 && <Polyline positions={waypoints} color="blue" />}
    </>
  );
}

function MapViewSimulation({ waypoints, position, yaw }) {
  return (
    
      <MapContainer 
        center={[55.7558, 37.6173]} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }} // Убедитесь, что контейнер карты имеет размеры
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MovingMarker position={position} waypoints={waypoints} yaw={yaw} />
      </MapContainer>
    
  );
}

export default MapViewSimulation;
