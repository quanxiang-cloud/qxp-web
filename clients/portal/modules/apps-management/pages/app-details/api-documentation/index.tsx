import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import store from './store';
import DocumentNav from './document-nav';
import ApiDocumentDetails from './document-detalis';

import './index.scss';

function ApiDocument(): JSX.Element {
  const { appID } = useParams<AppParams>();

  useEffect(() => {
    store.appID = appID;
  }, [appID]);

  useEffect(() => {
    store.fetchDataModels();
  }, []);

  return (
    <>
      <DocumentNav/>
      <ApiDocumentDetails />
    </>
  );
}

export default ApiDocument;
