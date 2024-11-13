import React, { useState } from 'react';

function DroneParameters({ onSubmit }) {
  const [speed, setSpeed] = useState('');
  const [altitude, setAltitude] = useState('');
  const [flightTime, setFlightTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const droneData = {
      speed: parseFloat(speed),
      altitude: parseFloat(altitude),
      flightTime: parseInt(flightTime),
    };
    onSubmit(droneData);
  };

  return (
    <div className="drone-parameters">
      <form onSubmit={handleSubmit}>
        <label>Скорость (м/с):</label>
        <input type="number" value={speed} onChange={(e) => setSpeed(e.target.value)} />
        
        <label>Высота (м):</label>
        <input type="number" value={altitude} onChange={(e) => setAltitude(e.target.value)} />
        
        <label>Время полёта (мин):</label>
        <input type="number" value={flightTime} onChange={(e) => setFlightTime(e.target.value)} />
        
        <button type="submit">Сохранить параметры</button>
      </form>
    </div>
  );
}

export default DroneParameters;
