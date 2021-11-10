import React from 'react';

import Icon from '@c/icon';
import Tooltip from '@c/tooltip';

type Props = {
  status: ProcessStatus;
}

const STATUS_COLOR: Record<string, { color: string, name: string }> = {
  SUCCESS: { color: 'green', name: '成功' },
  ING: { color: 'yellow', name: '进行中' },
  FAILED: { color: 'red', name: '失败' },
  ONLINE: { color: 'green', name: '在线' },
};

function StatusDisplay({ status }: Props): JSX.Element {
  return (
    <div className="flex items-center">
      <div
        style={{ boxShadow: `0 0 12px var(--${STATUS_COLOR[status].color}-400)` }}
        className={`bg-${STATUS_COLOR[status].color}-600 h-8 w-8 rounded-full`}
      />
      <span className="ml-10">{STATUS_COLOR[status].name}</span>
      {status === 'FAILED' && (
        <Tooltip label='错误原因提示，暂时无法做到语意化' position='top' >
          <Icon clickable className="ml-8" name="error" style={{ color: 'red' }} />
        </Tooltip>
      )}
    </div>
  );
}

export default StatusDisplay;
