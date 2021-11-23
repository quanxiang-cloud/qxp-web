import React from 'react';

import StatusDisplay from '../component/status';
import store from '../store';

type Props = {
  state: FaasProcessStatus;
  versionID: string;
  message: string;
  serverState: FaasProcessStatus;
  visibility: FaasVersionServingStatus;
}

export default function VersionStatus({
  state,
  versionID,
  message,
  serverState,
  visibility,
}: Props): JSX.Element {
  if (state === 'True') {
    const onlineStatus = visibility === 'online' ? 'True' : 'False';

    return (
      <StatusDisplay
        errorMsg={message}
        status={serverState === 'Unknown' ? 'Unknown' : onlineStatus}
        customText={{
          Unknown: visibility === 'online' ? '上线中' : '下线中',
          True: '在线',
          False: '离线',
        }}
        topic='serving'
        dataID={versionID}
        callBack={(data) => store.versionStateChangeListener(versionID, data, 'serverState')} />
    );
  }

  return (
    <StatusDisplay
      errorMsg={message}
      status={state || 'Unknown'}
      topic='builder'
      dataID={versionID}
      callBack={(data) => store.versionStateChangeListener(versionID, data, 'state')} />
  );
}
