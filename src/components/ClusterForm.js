import React, { Component } from 'react';
import styles from './ClusterForm.module.scss';

class ClusterForm extends Component {
  state = {
    cluster: ''
  };

  handleInput = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.props.handleSubmit(this.state.cluster);
  };

  handleDemo = () => {
    this.props.handleDemo(50);
  };

  render() {
    const { cluster } = this.state;
    return (
      <div className={styles.container}>
        <form className={styles.form}>
          <label className={styles.form_label}>
            Cluster Address
            <input
              className={styles.form_input}
              name="cluster"
              type="text"
              onChange={this.handleInput}
              value={cluster}
            />
          </label>
          <button
            disabled={cluster.length === 0}
            className={styles.button}
            type="submit"
            onClick={this.handleSubmit}
          >
            Connect
          </button>
          <button
            className={`${styles.button} ${styles.button__floatRight}`}
            type="button"
            onClick={this.handleDemo}
          >
            Demo
          </button>
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
