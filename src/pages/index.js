import React, { Fragment } from 'react';
import Helmet from 'react-helmet';
import PageWithScene from '../components/PageWithScene';

import '../styles/reset.scss';

export default () => {
  return (
    <Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="Description" content="Kubernetes 3D renderer" />
        <title>Kube3D</title>
        <html lang="en" />
      </Helmet>
      <PageWithScene />
    </Fragment>
  );
};
