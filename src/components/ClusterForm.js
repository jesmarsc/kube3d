import React, { Component } from 'react';
import styles from './ClusterForm.module.scss';

class ClusterForm extends Component {
  state = {
    cluster: '',
    password: ''
  };

  handleInput = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { cluster, password } = this.state;

    console.log('SUBMIT');
  };

  handleDemo = () => {
    console.log('DEMO');
  };

  render() {
    const { cluster, password } = this.state;
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
            Cluster
          </label>
          <label className={styles.form_label}>
            <input
              className={styles.form_input}
              name="password"
              type="password"
              onChange={this.handleInput}
              value={password}
            />
            Password
          </label>
          <button
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
      </div>
    );
  }
}

export default ClusterForm;
