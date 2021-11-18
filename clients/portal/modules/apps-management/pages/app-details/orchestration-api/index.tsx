import React from 'react';
import { useParams } from 'react-router-dom';

import { OrchestrationAPIStoreProvider } from './context';
import Layout from './layout';
import APINamespace from './containers';
import APINamespaceDetails from './containers/details';

import './style.scss';

export default function OrchestrationAPI(): JSX.Element {
  const { appID } = useParams<{ appID: string }>();

  return (
    <OrchestrationAPIStoreProvider appID={appID}>
      <Layout left={APINamespace} right={APINamespaceDetails} />
    </OrchestrationAPIStoreProvider>
  );
}
