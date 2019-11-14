import React, { Component, Fragment } from 'react';
import {
  Vector3,
  Color3,
  ArcRotateCamera,
  PointLight,
  HemisphericLight,
  StandardMaterial,
  Texture,
  MeshBuilder,
  CubeTexture
} from '@babylonjs/core';

import ClusterForm from '../components/ClusterForm';

import Scene from './Scene';

class PageWithScene extends Component {
  state = {
    showForm: true
  };

  onSceneMount = args => {
    const { canvas, scene, engine } = args;
    this.scene = scene;
    this.engine = engine;

    scene.clearColor = new Color3(0.09, 0.025, 0.09);

    const mainCamera = new ArcRotateCamera(
      'mainCamera',
      Math.PI / 2,
      Math.PI / 2,
      40,
      Vector3.Zero(),
      scene
    );
    mainCamera.useAutoRotationBehavior = true;
    mainCamera.attachControl(canvas, true);

    /* Setup Lights */
    const pointLight = new PointLight('pointLight', new Vector3.Zero(), scene);
    pointLight.intensity = 1;

    const topLight = new HemisphericLight('topLight', new Vector3.Up(), scene);
    topLight.intensity = 0.5;

    /* Setup Materials */
    this.nodeMaterial = new StandardMaterial('nodeMaterial', scene);
    this.nodeMaterial.diffuseColor = new Color3(0.5, 0.05, 0.5);

    this.masterMaterial = new StandardMaterial('masterMaterial', scene);
    this.masterMaterial.emissiveColor = new Color3(1, 1, 1);
    this.masterMaterial.diffuseTexture = new Texture('2k_sun.jpg', scene);

    this.pickedMaterial = new StandardMaterial('pickedMaterial', scene);
    this.pickedMaterial.diffuseColor = new Color3.Red();

    /* Setup Skybox */
    let skybox = new CubeTexture('skybox/space', scene);
    scene.createDefaultSkybox(skybox, false, 10000);

    engine.runRenderLoop(() => {
      if (scene) scene.render();
    });
  };

  drawDemo = () => {
    const scene = this.scene;
    const golden_ratio = (Math.sqrt(5) + 1) / 2;
    const golden_angle = (2 - golden_ratio) * (2 * Math.PI);

    const nodeCount = 50;
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

    const master = MeshBuilder.CreateSphere('master', { diameter: 5 }, scene);
    master.material = this.masterMaterial;
    this.setState({ showForm: false });
  };

  handleClick = () => {
    const scene = this.scene;
    const pickResult = scene.pick(scene.pointerX, scene.pointerY);

    const { pickedMesh } = pickResult;

    if (this.pickedMesh) {
      this.pickedMesh.material =
        this.pickedMesh.id === 'master'
          ? this.masterMaterial
          : this.nodeMaterial;
    }
    if (pickResult.hit) pickedMesh.material = this.pickedMaterial;
    this.pickedMesh = pickedMesh;
  };

  render() {
    const { showForm } = this.state;
    let form = null;
    if (showForm) form = <ClusterForm drawDemo={this.drawDemo} />;

    return (
      <Fragment>
        {form}
        <Scene
          onSceneMount={this.onSceneMount}
          handleClick={this.handleClick}
        />
      </Fragment>
    );
  }
}

export default PageWithScene;
