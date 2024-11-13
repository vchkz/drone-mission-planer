import React from 'react';

function ControlPoints({ points, onAltitudeChange }) {
  const handleAltitudeChange = (index, event) => {
    onAltitudeChange(index, parseFloat(event.target.value));
  };

  return (
    <div className="control-points" style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <ul>
        {points.map((point, index) => (
          <li key={index}>
            Точка {index + 1} - Высота: 
            <input
              type="number"
              value={point.altitude}
              onChange={(e) => handleAltitudeChange(index, e)}
              style={{ width: "60px", marginLeft: "5px" }}
            /> м
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ControlPoints;
