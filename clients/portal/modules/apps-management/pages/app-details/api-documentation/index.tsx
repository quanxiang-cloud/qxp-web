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
    store.fetchDataModels();
    return () => {
      store.tableID = '';
    };
  }, [appID]);

  return (
    <div className="bg-white flex h-full rounded-t-12">
      <DocumentNav/>
      <ApiDocumentDetails />
    </div>
  );
}

export default ApiDocument;
