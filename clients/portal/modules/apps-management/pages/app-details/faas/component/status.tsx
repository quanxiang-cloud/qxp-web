import React, { useEffect } from 'react';
import { useUpdateEffect } from 'react-use';

import Icon from '@c/icon';
import Tooltip from '@c/tooltip';
import ws, { SocketData } from '@lib/push';

type Props = {
  status: ProcessStatus;
  topic: string;
  dataID: string;
  callBack: (data: SocketData) => any;
  errorMsg?: string;
}

const STATUS_COLOR: Record<string, { color: string, name: string }> = {
  True: { color: 'green', name: '成功' },
  Unknown: { color: 'yellow', name: '进行中' },
  False: { color: 'red', name: '失败' },
  ONLINE: { color: 'green', name: '在线' },
};

function StatusDisplay({ status, topic, dataID, callBack, errorMsg = '暂时无法做到语意化' }: Props): JSX.Element {
  useEffect(() => {
    if (status === 'Unknown') {
      ws.subscribe({
        key: dataID, topic, type: 'faas', cb: callBack,
      });
    }
  }, []);

  useUpdateEffect(() => {
    if (status !== 'Unknown') {
      ws.removeEventListener('faas', dataID);
    }
  }, [status]);

  return (
    <div className="flex items-center">
      <div
        style={{ boxShadow: `0 0 12px var(--${STATUS_COLOR[status].color}-400)` }}
        className={`bg-${STATUS_COLOR[status].color}-600 h-8 w-8 rounded-full`}
      />
      <span className="ml-10">{STATUS_COLOR[status].name}</span>
      {status === 'False' && (
        <Tooltip label={errorMsg} position='top' >
          <Icon clickable className="ml-8" name="error" style={{ color: 'red' }} />
        </Tooltip>
      )}
    </div>
  );
}

export default StatusDisplay;
