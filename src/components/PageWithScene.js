import React, { Component } from 'react';
import * as BABYLON from '@babylonjs/core';

import Scene from './Scene';

class PageWithScene extends Component {
  onSceneMount = args => {
    const { canvas, scene, engine } = args;

    scene.clearColor = new BABYLON.Color3(0.09, 0.025, 0.09);

    const mainCamera = new BABYLON.ArcRotateCamera(
      'mainCamera',
      0,
      Math.PI / 2,
      -40,
      BABYLON.Vector3.Zero(),
      scene
    );

    mainCamera.angularSensibilityY *= -1;

    mainCamera.useAutoRotationBehavior = true;

    mainCamera.attachControl(canvas, true);

    const pointLight = new BABYLON.PointLight(
      'pointLight',
      new BABYLON.Vector3.Zero(),
      scene
    );
    pointLight.intensity = 0.75;

    const hemisphericLight = new BABYLON.HemisphericLight(
      'hemisphericLight',
      new BABYLON.Vector3(0, 1, 0),
      scene
    );

    hemisphericLight.intensity = 0.5;

    let nodeMaterial = new BABYLON.StandardMaterial('nodeMaterial', scene);
    nodeMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.05, 0.5);

    const golden_ratio = (Math.sqrt(5) + 1) / 2;
    const golden_angle = (2 - golden_ratio) * (2 * Math.PI);

    const nodeCount = 10;
    for (let i = 1; i <= nodeCount; ++i) {
      const latitude = Math.asin(-1 + (2 * i) / (nodeCount + 1));
      const longitude = golden_angle * i;

      const x = Math.cos(longitude) * Math.cos(latitude);
      const y = Math.sin(longitude) * Math.cos(latitude);
      const z = Math.sin(latitude);

      const position = new BABYLON.Vector3(x, y, z).scale(10);

      const sphere = BABYLON.MeshBuilder.CreateSphere(
        `node${i}`,
        { diameter: 1.5 },
        scene
      );

      sphere.position = position;
      sphere.material = nodeMaterial;
    }

    let masterMaterial = new BABYLON.StandardMaterial('masterMaterial', scene);
    masterMaterial.emissiveColor = new BABYLON.Color3(1, 0.2, 1);

    const master = BABYLON.MeshBuilder.CreateSphere(
      'master',
      { diameter: 5 },
      scene
    );

    master.material = masterMaterial;

    let skybox = new BABYLON.CubeTexture('skybox/space', scene);
    scene.createDefaultSkybox(skybox, false, 10000);

    engine.runRenderLoop(() => {
      if (scene) scene.render();
    });
  };

  render() {
    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <Scene onSceneMount={this.onSceneMount} />
      </div>
    );
  }
}

export default PageWithScene;
