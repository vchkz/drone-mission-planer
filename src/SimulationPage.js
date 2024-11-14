import React, { useState, useEffect, useRef } from 'react';
import FlightInfo from './FlightInfo';
import MapViewSimulation from './MapViewSimulation';
import DroneView from './DroneView';
import './App.css';

function SimulationPage({ controlPoints, droneData }) {
  const [waypoints, setWaypoints] = useState([]);
  const [position, setPosition] = useState([1.1, 1.1]);
  const [altitude, setAltitude] = useState(0);
  const [yaw, setYaw] = useState(0);
  const [roll, setRoll] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket соединение установлено");
      if (controlPoints.length > 0) {
        const waypointsData = controlPoints.map(point => ({
          lat: point.position[0],
          lng: point.position[1],
          alt: point.altitude,
        }));
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'waypoints', data: waypointsData }));

        if (droneData.speed) {
            ws.send(JSON.stringify({ type: 'speed', data: droneData.speed }));
            console.log("Скорость отправлена на сервер:", droneData.speed);
          }

        } else {
          console.error("WebSocket не готов к отправке данных");
        }
      }
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'position') {
        const { lat, lng, alt, yaw_angle, roll_angle, pitch_angle } = message.data;
        setPosition([lat, lng]);
        setAltitude(alt);
        setYaw(yaw_angle);
        setRoll(roll_angle);
        setPitch(pitch_angle);
      } else if (message.type === 'waypoints') {
        setWaypoints(message.data.map(point => [point.lat, point.lng]));
      }
    };

    ws.onerror = (error) => {
      console.error("Ошибка WebSocket:", error);
    };

    ws.onclose = (event) => {
      console.warn("WebSocket соединение закрыто", event);
    };

    return () => {
      if (ws) {
        ws.close();
        console.log("WebSocket закрыт при размонтировании компонента");
      }
    };
  }, [controlPoints]);

  const startTransmission = () => {
    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ command: 'start' }));
      console.log("Команда 'start' отправлена");
    } else {
      console.error("WebSocket не готов к отправке команды 'start'");
    }
  };

  return (
    <div className="simulation-app container-fluid">
      <div className="d-flex justify-content-between align-items-center bg-light p-3 border-bottom">
        <h5>Симуляция полета</h5>
        <button onClick={startTransmission} className="btn btn-success">Start Transmission</button>
      </div>

      <div className="simulation-main row">
        <div className="col-md-8 p-3">
          
              <MapViewSimulation waypoints={waypoints} position={position} yaw={yaw} />
            
        </div>

        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <DroneView roll={roll} pitch={pitch} />
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <FlightInfo currentSpeed={droneData.speed} mode="Самолёт" altitude={altitude} yaw={yaw} roll={roll} pitch={pitch} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimulationPage;
