import React, { useEffect, useState } from 'react';

import { setBatchGlobalConfig } from '@lib/api/user-config';
import type { Schema } from '@ofa/schema-spec';
import toast from '@lib/toast';
import PageSchemaRender from '@c/page-schema-render';

import { getSchemaKey } from '../api';

type Props = {
  appID: string;
  pageID: string;
  previewSchema: Schema;
}

function Preview({ appID, pageID, previewSchema }: Props): JSX.Element {
  const schemaKey = getSchemaKey(appID, pageID, true);
  const [savingDraft, setSavingDraft] = useState(true);

  useEffect(() => {
    const config = { key: schemaKey, version: '1.0.0', value: JSON.stringify(previewSchema) };
    setBatchGlobalConfig([config]).then(() => {
      setSavingDraft(false);
    }).catch((err) => {
      toast.error(err);
    });
  }, []);

  if (savingDraft) {
    return (
      <h1>处理中......</h1>
    );
  }

  return (
    <PageSchemaRender
      schemaKey={schemaKey}
      version="1.0.0"
    />
  );
}

export default Preview;
