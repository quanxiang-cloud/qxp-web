import React, { useEffect, useState } from 'react';

import { setBatchGlobalConfig } from '@lib/api/user-config';
import type { Artery } from '@one-for-all/artery';
import toast from '@lib/toast';

import { getSchemaKey } from '../api';
import ArteryRender from '@c/artery-renderer';

type Props = {
  appID: string;
  pageID: string;
  previewSchema: Artery;
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
    <ArteryRender
      arteryID={schemaKeys[0]}
      version="0.1.0"
    />
  );
}

export default Preview;
