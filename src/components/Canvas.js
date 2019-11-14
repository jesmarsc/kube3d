import React, { Component } from 'react';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  PointLight
} from 'react-babylonjs';
import {
  Color3,
  Vector3,
  Texture,
  MeshBuilder,
  StandardMaterial,
  CubeTexture
} from '@babylonjs/core';

class Canvas extends Component {
  onResizeWindow = () => {
    if (this.engine) {
      this.engine.resize();
      this.forceUpdate();
    }
  };

  onSceneMount = e => {
    this.scene = e.scene;
    this.engine = e.scene.getEngine();

    const scene = this.scene;

    /* Setup Skybox */
    let skybox = new CubeTexture('skybox/space', scene);
    scene.createDefaultSkybox(skybox, false, 10000);

    /* Setup Materials */
    this.nodeMaterial = new StandardMaterial('nodeMaterial', scene);
    this.nodeMaterial.diffuseColor = new Color3(0.5, 0.05, 0.5);

    this.masterMaterial = new StandardMaterial('masterMaterial', scene);
    this.masterMaterial.emissiveColor = new Color3(1, 1, 1);
    this.masterMaterial.diffuseTexture = new Texture('2k_sun.jpg', scene);

    this.selectedMaterial = new StandardMaterial('selectedMaterial', scene);
    this.selectedMaterial.diffuseColor = new Color3.Red();

    const golden_ratio = (Math.sqrt(5) + 1) / 2;
    const golden_angle = (2 - golden_ratio) * (2 * Math.PI);

    const nodeCount = 10;
    for (let i = 1; i <= nodeCount; ++i) {
      const latitude = Math.asin(-1 + (2 * i) / (nodeCount + 1));
      const longitude = golden_angle * i;

      const x = Math.cos(longitude) * Math.cos(latitude);
      const y = Math.sin(longitude) * Math.cos(latitude);
      const z = Math.sin(latitude);

      const position = new Vector3(x, y, z).scale(10);

      const sphere = MeshBuilder.CreateSphere(
        `node${i}`,
        { diameter: 1.5 },
        scene
      );

      sphere.position = position;
      sphere.material = this.nodeMaterial;
    }

    window.addEventListener('resize', this.onResizeWindow);
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeWindow);
  }

  render() {
    return (
      <Engine
        antialias={true}
        width={window.innerWidth}
        height={window.innerHeight}
      >
        <Scene onSceneMount={this.onSceneMount}>
          <ArcRotateCamera
            useAutoRotationBehavior={true}
            name="mainCamera"
            target={Vector3.Zero()}
            radius={40}
            alpha={0}
            beta={Math.PI / 2}
          />
          <HemisphericLight
            name="hemisphericLight"
            intensity={0.5}
            direction={new Vector3.Up()}
          />
          <PointLight
            name="pointLight"
            intensity={0.8}
            position={new Vector3.Zero()}
          />
        </Scene>
      </Engine>
    );
  }
}

export default Canvas;
