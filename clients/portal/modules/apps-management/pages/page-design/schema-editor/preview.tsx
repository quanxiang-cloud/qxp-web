import React, { useEffect, useState } from 'react';
import type { Artery } from '@one-for-all/artery';

import toast from '@lib/toast';
import ArteryRender from '@c/artery-renderer';
import { setBatchGlobalConfig } from '@lib/api/user-config';

import { getSchemaKey } from '../utils';

type Props = {
  schemaID: string;
  previewSchema: Artery;
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
    <ArteryRender
      arteryID={schemaKey}
      version="0.1.0"
    />
  );
}

export default Preview;
