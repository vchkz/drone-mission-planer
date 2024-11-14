import React from 'react';

function ControlPoints({ points, onAltitudeChange }) {
  const handleAltitudeChange = (index, event) => {
    onAltitudeChange(index, parseFloat(event.target.value));
  };

  return (
    <div className="control-points p-4" style={{ maxHeight: 'calc(100vh - 110px)', overflowY: 'auto' }}>
      <h3>Контрольные точки</h3>
      <ul className="list-group">
        {points.map((point, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>Точка {index + 1}</strong>
              <div>
                <span>lat: {point.position[0].toFixed(6)} </span><br />
                <span>lon: {point.position[1].toFixed(6)}</span>
              </div>
            </div>
            <div>
              <label htmlFor={`altitude-${index}`} className="form-label mb-0">Высота (м):</label>
              <input
                id={`altitude-${index}`}
                type="number"
                value={point.altitude}
                onChange={(e) => handleAltitudeChange(index, e)}
                className="form-control form-control-sm"
                style={{ width: "100px" }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ControlPoints;
