import React from 'react';

import Icon from '@c/icon';
import Tooltip from '@c/tooltip';

import './index.scss';
import { FUNC_STATUS } from '../constants';

type Props = {
  status: number;
  errorMsg?: string;
  customText?: Record<number, string>;
}

const STATUS_INFO: Record<number, { color: string, name: string }> = {
  [FUNC_STATUS.StatusNull]: { color: 'blue', name: '未开始' },
  [FUNC_STATUS.StatusBuilding]: { color: 'yellow', name: '构建中' },
  [FUNC_STATUS.StatusFailed]: { color: 'red', name: '构建失败' },
  [FUNC_STATUS.StatusOK]: { color: 'green', name: '构建成功' },
  [FUNC_STATUS.StatusOnline]: { color: 'green', name: '上线' },
  [FUNC_STATUS.StatusOffline]: { color: 'green', name: '下线' },
  [FUNC_STATUS.OnlineBuilding]: { color: 'yellow', name: '上线中' },
  [FUNC_STATUS.OnlineFailed]: { color: 'red', name: '上线失败' },
};

function StatusDisplay({
  status,
  customText,
  errorMsg = '暂时无法做到语意化',
}: Props): JSX.Element {
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
