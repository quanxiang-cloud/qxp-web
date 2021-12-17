import React from 'react';
import { useParams } from 'react-router-dom';

import PageSchemaRender from '@c/page-schema-render';
import { getStore } from '@ofa/page-engine';
import { getSchemaKey, getVersionKey } from '../api';

interface Props {
  className?: string;
}

function PagePreview(props: Props) {
  const { appID, pageId } = useParams<{appID: string, pageId: string}>();
  const pageCtx = getStore();
  const repository = {
    'ofa-ui@latest': pageCtx.registry.toComponentMap(),
  };

  return (
    <PageSchemaRender
      schemaKey={getSchemaKey(appID, pageId, true)}
      version={getVersionKey()}
      repository={repository}
    />
  );
}

export default PagePreview;
