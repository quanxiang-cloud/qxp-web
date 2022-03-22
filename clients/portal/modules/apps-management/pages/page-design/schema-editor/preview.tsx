import React, { useEffect, useState } from 'react';

import { setBatchGlobalConfig } from '@lib/api/user-config';
import type { Schema } from '@one-for-all/schema-spec';
import toast from '@lib/toast';

import { getSchemaKey } from '../api';

type Props = {
  appID: string;
  pageID: string;
  previewSchema: Schema;
}

function Preview({ appID, pageID, previewSchema }: Props): JSX.Element {
  const schemaKeys = getSchemaKey(appID, pageID, true);
  const [savingDraft, setSavingDraft] = useState(true);

  useEffect(() => {
    setBatchGlobalConfig(schemaKeys.map((schemaKey) => ({
      key: schemaKey, version: '1.0.0', value: JSON.stringify(previewSchema),
    }))).then(() => {
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
    <h1>this will be implement later</h1>
  );

  // return (
  //   <PageSchemaRender
  //     schemaKeys={schemaKeys}
  //     version="1.0.0"
  //   />
  // );
}

export default Preview;
