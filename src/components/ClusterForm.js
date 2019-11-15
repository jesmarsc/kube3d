import React, { Component } from 'react';
import styles from './ClusterForm.module.scss';

class ClusterForm extends Component {
  state = {
    cluster: '',
    nodeCount: 50
  };

  handleInput = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.handleSubmit(this.state.cluster);
  };

  handleDemo = event => {
    event.preventDefault();
    this.props.handleDemo(this.state.nodeCount);
  };

  render() {
    const { cluster, nodeCount } = this.state;
    return (
      <div className={styles.container}>
        <form className={styles.form}>
          <label className={styles.form_label}>
            <input
              className={styles.form_input}
              name="cluster"
              type="text"
              onChange={this.handleInput}
              value={cluster}
            />
            Cluster Address
            <button
              style={{ display: 'inline', borderTop: 'none' }}
              disabled={cluster.length === 0}
              className={`${styles.button} ${styles.button__floatRight}`}
              type="submit"
              onClick={this.handleSubmit}
            >
              Connect
            </button>
          </label>
        </form>

        <form className={styles.form}>
          <label className={styles.form_label}>
            <input
              className={styles.form_input}
              name="nodeCount"
              type="number"
              onChange={this.handleInput}
              min={1}
              value={nodeCount}
            />
            Node Count
            <button
              style={{ display: 'inline', borderTop: 'none' }}
              className={`${styles.button} ${styles.button__floatRight}`}
              type="submit"
              onClick={this.handleDemo}
            >
              Demo
            </button>
          </label>
        </form>
        <p className={styles.instructions}>
          Add permission to get nodes for <br />
          system:anonymous on your cluster
        </p>
      </div>
    );
  }
}

export default ClusterForm;
