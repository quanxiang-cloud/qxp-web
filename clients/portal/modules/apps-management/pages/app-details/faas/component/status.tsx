import React, { useEffect } from 'react';
import { useUpdateEffect } from 'react-use';

import Icon from '@c/icon';
import Tooltip from '@c/tooltip';
import ws, { SocketData } from '@lib/push';

import { wsSubscribe } from '../api';

import './index.scss';

type Props = {
  status: number;
  topic: string;
  dataID: string;
  callBack: (data: SocketData) => any;
  errorMsg?: string;
  customText?: Record<number, string>;
}

const STATUS_INFO: Record<number, { color: string, name: string }> = {
  0: { color: 'blue', name: '未开始' },
  1: { color: 'yellow', name: '构建中' },
  2: { color: 'red', name: '失败' },
  3: { color: 'green', name: '成功' },
  7: { color: 'yellow', name: '上线中' },
};

function StatusDisplay({
  status,
  topic,
  dataID,
  callBack,
  customText,
  errorMsg = '暂时无法做到语意化',
}: Props): JSX.Element {
  // console.log(status, dataID);
  useEffect(() => {
    if (status < 2) {
      console.log(status, dataID);
      wsSubscribe({
        topic: 'builder',
        key: dataID,
        uuid: ws.uuid,
      });
    }

    if (status === 7) {
      wsSubscribe({
        topic: 'serving',
        key: dataID,
        uuid: ws.uuid,
      });
    }
    ws.addEventListener('faas', `status-${dataID}`, callBack);
    return () => {
      ws.removeEventListener('faas', `status-${dataID}`);
    };
  }, [status]);

  useUpdateEffect(() => {
    if (status > 1) {
      ws.removeEventListener('faas', `status-${dataID}`);
    }
  }, [status]);

  return (
    <div className="flex items-center">
      <div
        style={{
          '--status-color': `var(--${STATUS_INFO[status].color}-600)`,
          '--status-shadow-color': `var(--${STATUS_INFO[status].color}-400)`,
          boxShadow: `0 0 12px var(--${STATUS_INFO[status].color}-400)`,
          backgroundColor: `var(--${STATUS_INFO[status].color}-600)`,
        } as React.CSSProperties}
        className='relative w-8 h-8 rounded-full'
      >
        {
          status === 0 && (
            <div className="animate-ping h-full w-full rounded-full opacity-75 faas-status-pulse"></div>
          )
        }
      </div>
      <span className="ml-10">{customText?.[status] || STATUS_INFO[status].name}</span>
      {status === 2 && !!errorMsg && (
        <Tooltip label={errorMsg} position='top' >
          <Icon clickable className="ml-8" name="error" style={{ color: 'red' }} />
        </Tooltip>
      )}
    </div>
  );
}

export default StatusDisplay;
