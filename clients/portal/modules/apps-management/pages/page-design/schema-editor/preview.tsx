import React, { useEffect, useState } from 'react';
import type { Schema } from '@one-for-all/schema-spec';

import toast from '@lib/toast';
import PageSchemaRender from '@c/page-schema-render';
import { setBatchGlobalConfig } from '@lib/api/user-config';

import { getSchemaKey } from '../utils';

type Props = {
  schemaID: string;
  previewSchema: Schema;
}

function Preview({ schemaID, previewSchema }: Props): JSX.Element {
  const schemaKey = getSchemaKey(schemaID, true);
  const [savingDraft, setSavingDraft] = useState(true);

  useEffect(() => {
    setBatchGlobalConfig([{
      key: schemaKey,
      version: '1.0.0',
      value: JSON.stringify(previewSchema),
    }]).then(() => {
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
