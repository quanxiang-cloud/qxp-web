import React, { useEffect, useState } from 'react';
import type { Artery } from '@one-for-all/artery';

import toast from '@lib/toast';
import ArteryRenderer from '@c/artery-renderer';
import { setBatchGlobalConfig } from '@lib/api/user-config';

import { getArteryKeys } from '../utils';

type Props = {
  draftArteryID: string;
  previewSchema: Artery;
}

function Preview({ draftArteryID, previewSchema }: Props): JSX.Element {
  const [draftArteryKey] = getArteryKeys(draftArteryID, true);
  const [savingDraft, setSavingDraft] = useState(true);

  useEffect(() => {
    setBatchGlobalConfig([{
      key: draftArteryKey,
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
    <ArteryRenderer
      arteryID={draftArteryKey}
      version="0.1.0"
    />
  );
}

export default Preview;
