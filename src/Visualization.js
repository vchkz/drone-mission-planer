import React, { useEffect, useRef } from 'react';
import * as BABYLON from 'babylonjs';

function Visualization() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    // Создание камеры
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Создание света
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);

    // Создание земли
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);

    // Создание объекта (например, коробки)
    const plane = BABYLON.MeshBuilder.CreateBox("plane", { height: 0.2, width: 0.5, depth: 1 }, scene);
    plane.position.y = 1;

    // Обработчик изменения размеров окна
    window.addEventListener("resize", () => {
      engine.resize(); // Обновление размеров сцены при изменении размера окна
    });

    engine.runRenderLoop(() => {
      scene.render();
    });

    return () => {
      engine.dispose();
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default Visualization;
