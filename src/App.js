import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Papa from 'papaparse';
import DroneParameters from './DroneParameters';
import ControlPoints from './ControlPoints';
import MapView from './MapView';
import SimulationPage from './SimulationPage';
import './App.css';

function App() {
  const fileInputRef = useRef(null);

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const [droneData, setDroneData] = useState({ altitude: 0 });
  const [controlPoints, setControlPoints] = useState([]);

  const addControlPoint = (newPoint) => {
    const newControlPoint = { position: newPoint, altitude: droneData.altitude || 0 };
    setControlPoints([...controlPoints, newControlPoint]);
  };

  const updateControlPoint = (index, newPosition) => {
    const updatedPoints = [...controlPoints];
    updatedPoints[index].position = newPosition;
    setControlPoints(updatedPoints);
  };

  const updateControlPointAltitude = (index, newAltitude) => {
    const updatedPoints = [...controlPoints];
    updatedPoints[index].altitude = newAltitude;
    setControlPoints(updatedPoints);
  };

  const removeControlPoint = (index) => {
    setControlPoints(controlPoints.filter((_, idx) => idx !== index));
  };

  const loadPointsFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const newPoints = results.data.map(row => ({
          position: [parseFloat(row[0]), parseFloat(row[1])],
          altitude: parseFloat(row[2]) || droneData.altitude,
        }));
        setControlPoints([...controlPoints, ...newPoints]);
      }
    });
  };

  const exportPointsToCSV = () => {
    const pointsToExport = controlPoints.map(point => ({
      lat: point.position[0],
      lon: point.position[1],
      alt: point.altitude
    }));

    const csv = Papa.unparse(pointsToExport, {
      delimiter: ";",
      header: false
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "control_points.csv");
    link.click();
  };

  return (
    <Router>
      <div className="App">
        <h1>Планировщик полётных миссий БВС</h1>
        <nav>
          <Link to="/">Главная</Link>
          <Link to="/simulation">Симуляция</Link>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div className="container">
                <div className="left-panel">
                  <DroneParameters onSubmit={setDroneData} />
                  <div className="file-upload">
                    <button onClick={handleFileButtonClick}>Импортировать точки из CSV</button>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv"
                      ref={fileInputRef}
                      onChange={loadPointsFromFile}
                      style={{ display: "none" }}
                    />
                  </div>
                  <button onClick={exportPointsToCSV}>Экспортировать точки в CSV</button>
                </div>
                <div className="map-container">
                  <MapView
                    points={controlPoints}
                    onAddPoint={addControlPoint}
                    onUpdatePoint={updateControlPoint}
                    onRemovePoint={removeControlPoint}
                  />
                </div>
                <div className="right-panel">
                  <ControlPoints
                    points={controlPoints}
                    onAltitudeChange={updateControlPointAltitude}
                  />
                </div>
              </div>
            }
          />
          <Route path="/simulation" element={<SimulationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
