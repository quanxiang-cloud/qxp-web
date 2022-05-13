import React, { useEffect } from 'react';
import { useUpdateEffect } from 'react-use';

import ws from '@lib/push';

import { wsSubscribe } from '../api';

import StatusDisplay from '../component/status';
import store from '../func/store';
import { FUNC_STATUS } from '../constants';

type Props = {
  state: number;
  versionID: string;
  message: string;
}

export default function VersionStatus({
  state,
  versionID,
  message,
}: Props): JSX.Element {
  useEffect(() => {
    if (state < FUNC_STATUS.StatusFailed) {
      wsSubscribe({
        topic: 'builder',
        key: versionID,
        uuid: ws.uuid,
      });
    }

    if (state === FUNC_STATUS.OnlineBuilding) {
      wsSubscribe({
        topic: 'serving',
        key: versionID,
        uuid: ws.uuid,
      });
    }
    ws.addEventListener(
      'faas',
      `status-${versionID}`,
      (data) => store.versionStateChangeListener(versionID, data, 'status'));
    return () => {
      ws.removeEventListener('faas', `status-${versionID}`);
    };
  }, [state]);

  useUpdateEffect(() => {
    if (state !== FUNC_STATUS.StatusBuilding && state !== FUNC_STATUS.OnlineBuilding) {
      ws.removeEventListener('faas', `status-${versionID}`);
    }
  }, [state]);

  return (
    <StatusDisplay
      errorMsg={message}
      status={state || 0}
    />
  );
}
