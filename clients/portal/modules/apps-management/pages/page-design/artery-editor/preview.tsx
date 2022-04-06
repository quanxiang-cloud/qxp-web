import React, { useEffect, useState } from 'react';

import { setBatchGlobalConfig } from '@lib/api/user-config';
import type { Artery } from '@one-for-all/artery';
import toast from '@lib/toast';

import { getArteryKey } from '../api';
import ArteryRender from '@c/artery-renderer';

type Props = {
  appID: string;
  pageID: string;
  artery: Artery;
}

function Preview({ appID, pageID, artery }: Props): JSX.Element {
  const arteryKeys = getArteryKey(appID, pageID, true);
  const [savingDraft, setSavingDraft] = useState(true);

  useEffect(() => {
    setBatchGlobalConfig(arteryKeys.map((arteryKey) => ({
      key: arteryKey, version: '1.0.0', value: JSON.stringify(artery),
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
      arteryID={arteryKeys[0]}
      version="0.1.0"
    />
  );
}

export default Preview;
