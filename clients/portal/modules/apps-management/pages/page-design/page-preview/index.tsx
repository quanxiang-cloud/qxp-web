import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import PageSchemaRender from '@c/page-schema-render';
import { getSchemaKey, getVersionKey, getRenderRepository } from '../api';

interface Props {
  className?: string;
}

function PagePreview(props: Props) {
  const { appID, pageId } = useParams<{appID: string, pageId: string}>();
  const repository = useMemo(()=> getRenderRepository(), []);

  return (
    <PageSchemaRender
      schemaKey={getSchemaKey(appID, pageId, true)}
      version={getVersionKey()}
      repository={repository}
    />
  );
}

export default PagePreview;
