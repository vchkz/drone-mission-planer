import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Papa from 'papaparse';
import DroneParameters from './DroneParameters';
import ControlPoints from './ControlPoints';
import MapView from './MapView';
import SimulationPage from './SimulationPage';
import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const fileInputRef = useRef(null);

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const [droneData, setDroneData] = useState({ altitude: 100 });
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
      <div className="App vh-100 d-flex flex-column">
        <nav className="navbar navbar-dark bg-dark p-3">
          <div className='container-fluid'>
            <h3 className="text-light">Планировщик полётных миссий БВС</h3>
            <NavigationButton />
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div className="container-fluid flex-grow-1 d-flex">
                <div className="row flex-grow-1">
                  <div className="col-md-3 bg-light p-3">
                    <DroneParameters onSubmit={setDroneData} />
                    <div className='p-3 rounded shadow-sm'>
                      <button onClick={handleFileButtonClick} className="btn btn-secondary btn-block mt-2 w-100">Импортировать точки из CSV</button>
                      <input id="file-upload" type="file" accept=".csv" ref={fileInputRef} onChange={loadPointsFromFile} style={{ display: "none" }} />
                      <button onClick={exportPointsToCSV} className="btn btn-secondary btn-block mt-2 w-100">Экспортировать точки в CSV</button>
                    </div>
                  </div>
                  <div className="col-md-6 flex-grow-1">
                    <MapView points={controlPoints} onAddPoint={addControlPoint} onUpdatePoint={updateControlPoint} onRemovePoint={removeControlPoint} />
                  </div>
                  <div className="col-md-3 bg-light p-3 control-points-container">
                    <ControlPoints points={controlPoints} onAltitudeChange={updateControlPointAltitude} />
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/simulation" element={<SimulationPage controlPoints={controlPoints} droneData={droneData} />} />
        </Routes>
      </div>
    </Router>
  );
}

function NavigationButton() {
  const location = useLocation();

  return (
    <div className="d-flex align-items-center">
      <span className="mx-2" style={{ borderLeft: "1px solid gray", height: "24px" }}></span>
      {location.pathname === "/simulation" ? (
        <Link to="/" className="btn btn-outline-light mx-2">На главную</Link>
      ) : (
        <Link to="/simulation" className="btn btn-primary mx-2">Симуляция</Link>
      )}
      
    </div>
  );
}

export default App;
