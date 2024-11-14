import React, { useRef, useEffect } from 'react';
import { Engine, Scene, SceneLoader } from '@babylonjs/core';
import { ArcRotateCamera, Vector3, HemisphericLight } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

function DroneView({ roll, pitch }) {
  const canvasRef = useRef(null);
  const meshRef = useRef(null);

  useEffect(() => {
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    // Set up camera with restricted rotation
    const camera = new ArcRotateCamera("camera", Math.PI / 4, Math.PI / 2.5, 40, new Vector3(0, 1, 0), scene);
    camera.attachControl(canvasRef.current, true);

    // Lock the beta angle to restrict vertical rotation
    camera.lowerBetaLimit = camera.beta;
    camera.upperBetaLimit = camera.beta;

    // Add light
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Load model
    SceneLoader.ImportMesh(
      "",
      "", 
      "quadcopter.glb",
      scene,
      (meshes) => {
        console.log("Loaded meshes:", meshes);

        if (meshes[0]) {
          meshRef.current = meshes[0];
        }
      },
      null,
      (scene, message, exception) => {
        console.error("Error loading model:", message, exception);
      }
    );

    engine.runRenderLoop(() => {
      scene.render();
    });

    return () => {
      engine.dispose();
    };
  }, []);

  // Update roll and pitch
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation = new Vector3(pitch * (Math.PI / 180), 0, roll * (Math.PI / 180))
    }
  }, [roll, pitch]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
}

export default DroneView;
