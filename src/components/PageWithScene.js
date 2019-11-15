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
  CubeTexture,
  AssetContainer
} from '@babylonjs/core';
import axios from 'axios';
import ReactTable from 'react-table';
import * as faker from 'faker/locale/en_CA';

import 'react-table/react-table.css';
import styles from './PageWithScene.module.scss';
import formStyles from './ClusterForm.module.scss';

import ClusterForm from '../components/ClusterForm';

import Scene from './Scene';

const columns = [
  {
    Header: 'Name',
    accessor: 'cells[0]'
  },
  {
    Header: 'Status',
    accessor: 'cells[1]'
  },
  {
    Header: 'Role',
    accessor: 'cells[2]'
  },
  {
    Header: 'Age',
    accessor: 'cells[3]'
  },
  {
    Header: 'Version',
    accessor: 'cells[4]'
  },
  {
    Header: 'Internal-IP',
    accessor: 'cells[5]'
  },
  {
    Header: 'External-IP',
    accessor: 'cells[6]'
  },
  {
    Header: 'OS-Image',
    accessor: 'cells[7]'
  },
  {
    Header: 'Kernal-Version',
    accessor: 'cells[8]'
  },
  {
    Header: 'Container-Runtime',
    accessor: 'cells[9]'
  }
];

class PageWithScene extends Component {
  state = {
    showForm: true,
    nodes: [],
    selectedNode: []
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
    this.pickedMaterial.emissiveColor = new Color3.Red();

    /* Setup Skybox */
    let skybox = new CubeTexture('skybox/space', scene);
    scene.createDefaultSkybox(skybox, false, 10000);

    engine.runRenderLoop(() => {
      if (scene) scene.render();
    });
  };

  drawDemo = nodeCount => {
    const scene = this.scene;
    this.container = new AssetContainer(scene);
    const golden_ratio = (Math.sqrt(5) + 1) / 2;
    const golden_angle = (2 - golden_ratio) * (2 * Math.PI);

    const master = MeshBuilder.CreateSphere('0', { diameter: 5 }, scene);
    master.material = this.masterMaterial;
    this.container.meshes.push(master);

    for (let i = 1; i <= nodeCount - 1; i++) {
      const latitude = Math.asin(-1 + (2 * i) / (nodeCount + 1));
      const longitude = golden_angle * i;

      const x = Math.cos(longitude) * Math.cos(latitude);
      const y = Math.sin(longitude) * Math.cos(latitude);
      const z = Math.sin(latitude);
      const position = new Vector3(x, y, z).scale(10);

      const sphere = MeshBuilder.CreateSphere(`${i}`, { diameter: 2 }, scene);
      this.container.meshes.push(sphere);
      sphere.position = position;
      sphere.material = this.nodeMaterial;
    }

    this.setState({ showForm: false });
  };

  getDataFromCluster = async addr => {
    const response = await axios.get(
      `https://cors-anywhere.herokuapp.com/https://${addr}/api/v1/nodes`,
      {
        headers: {
          Accept: 'application/json;as=Table;g=meta.k8s.io;v=v1beta1'
        }
      }
    );
    const nodes = response.data.rows;
    this.setState({ nodes });
    this.drawDemo(nodes.length);
  };

  generateRandomData = nodeCount => {
    const nodes = [];

    for (let i = 0; i < nodeCount; i++) {
      const cells = [];
      cells.push(
        `node-${i}`,
        faker.helpers.randomize(['Running', 'Restarting']),
        'Node',
        `${faker.date.recent().getUTCHours()} hrs`,
        'v1.16.2',
        faker.internet.ip(),
        faker.internet.ip(),
        'Buildroot 2019.02.6',
        '4.19.76',
        'docker://18.9.9'
      );
      nodes.push({ cells });
    }

    this.setState({ nodes });
    this.drawDemo(nodes.length);
  };

  handleClick = () => {
    const scene = this.scene;
    const pickResult = scene.pick(scene.pointerX, scene.pointerY);

    const { pickedMesh } = pickResult;
    let selectedNode = [];

    if (this.pickedMesh) {
      this.pickedMesh.material =
        this.pickedMesh.id === '0' ? this.masterMaterial : this.nodeMaterial;
    }

    if (pickResult.hit) {
      pickedMesh.material = this.pickedMaterial;
      if (this.state.nodes[pickedMesh.id])
        selectedNode = [this.state.nodes[pickedMesh.id]];
    }
    this.pickedMesh = pickedMesh;
    this.setState({ selectedNode });
  };

  reset = () => {
    if (this.container) {
      for (const mesh of this.container.meshes) {
        mesh.dispose();
      }
    }
    this.container = null;
    this.setState({ showForm: true });
  };

  render() {
    const { showForm, nodes, selectedNode } = this.state;
    let form = null;
    if (showForm) {
      form = (
        <ClusterForm
          handleDemo={this.generateRandomData}
          handleSubmit={this.getDataFromCluster}
        />
      );
    } else {
      form = (
        <Fragment>
          <button
            style={{
              position: 'fixed',
              left: '16px',
              bottom: '16px',
              fontSize: '1.6rem'
            }}
            className={formStyles.button}
            onClick={this.reset}
          >
            {'<'} Back
          </button>
          <ReactTable
            NoDataComponent={() => null}
            minRows={1}
            showPagination={false}
            data={selectedNode}
            columns={columns}
            className={styles.table}
          />
        </Fragment>
      );
    }

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
