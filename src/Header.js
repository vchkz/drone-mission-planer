import React from 'react';

function Header({ speed, setSpeed, radius, setRadius, onStartPause }) {
  return (
    <div className="header">
      <div>
        <label>Скорость: </label>
        <input
          type="number"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        /> м/с
      </div>
      <div>
        <label>Минимальный радиус: </label>
        <input
          type="number"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
        /> м
      </div>
      <button onClick={onStartPause}>⏯️</button>
    </div>
  );
}

export default Header;
