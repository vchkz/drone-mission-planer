import React from 'react';

function FlightInfo({ currentSpeed, mode, altitude, yaw, roll, pitch }) {
  return (
    <div className="flight-info p-4 border rounded shadow-sm bg-light">
      <h5 className="mb-3 text-center">Информация о полёте</h5>
      <div className="row">
        <div className="col-6 mb-3">
          <p><strong>Скорость:</strong> {currentSpeed} м/с</p>
        </div>
        <div className="col-6 mb-3">
          <p><strong>Режим полёта:</strong> {mode}</p>
        </div>
        <div className="col-6 mb-3">
          <p><strong>Высота:</strong> {altitude} м</p>
        </div>
        <div className="col-6 mb-3">
          <p><strong>Угол рыскания:</strong> {yaw}</p>
        </div>
        <div className="col-6 mb-3">
          <p><strong>Угол крена:</strong> {roll}</p>
        </div>
        <div className="col-6 mb-3">
          <p><strong>Угол тангажа:</strong> {pitch}</p>
        </div>
      </div>
    </div>
  );
}

export default FlightInfo;
