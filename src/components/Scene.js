import React, { Component } from 'react';
import * as BABYLON from '@babylonjs/core';

class Scene extends Component {
  onResizeWindow = () => {
    if (this.engine) {
      this.engine.resize();
      this.forceUpdate();
    }
  };

  componentDidMount() {
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = new BABYLON.Scene(this.engine);

    if (typeof this.props.onSceneMount === 'function') {
      this.props.onSceneMount({
        scene: this.scene,
        engine: this.engine,
        canvas: this.canvas
      });
    } else {
      console.error('onSceneMount function not available');
    }

    // Resize the babylon engine when the window is resized
    window.addEventListener('resize', this.onResizeWindow);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeWindow);
  }

  setupCanvasRef = element => {
    if (element !== null) this.canvas = element;
  };

  render() {
    return (
      <canvas
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={this.props.handleClick}
        ref={this.setupCanvasRef}
      />
    );
  }
}

export default Scene;
