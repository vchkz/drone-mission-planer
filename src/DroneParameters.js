import React, { useState } from 'react';

function DroneParameters({ onSubmit }) {
  const [speed, setSpeed] = useState('10');
  const [altitude, setAltitude] = useState('100');


  const handleSubmit = (e) => {
    e.preventDefault();
    const droneData = {
      speed: parseFloat(speed),
      altitude: parseFloat(altitude),
    };
    onSubmit(droneData);
  };

  return (
    <div className="drone-parameters">
      <form onSubmit={handleSubmit} className="bg-light p-3 rounded shadow-sm">
        <div className="mb-3">
          <label htmlFor="speed" className="form-label">Скорость (м/с):</label>
          <input 
            id="speed" 
            type="number" 
            value={speed} 
            onChange={(e) => setSpeed(e.target.value)} 
            className="form-control" 
            required 
          />
        </div>
  
        <div className="mb-3">
          <label htmlFor="altitude" className="form-label">Высота (м):</label>
          <input 
            id="altitude" 
            type="number" 
            value={altitude} 
            onChange={(e) => setAltitude(e.target.value)} 
            className="form-control" 
            required 
          />
        </div>
  
        <button type="submit" className="btn btn-primary w-100">Сохранить параметры</button>
      </form>
    </div>
  );
  
}

export default DroneParameters;
