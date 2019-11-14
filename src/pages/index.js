import React, { Fragment } from 'react';
import PageWithScene from '../components/PageWithScene';
import ClusterForm from '../components/ClusterForm';

import '../styles/reset.scss';

export default () => {
  return (
    <Fragment>
      <ClusterForm />
      <PageWithScene />
    </Fragment>
  );
};
