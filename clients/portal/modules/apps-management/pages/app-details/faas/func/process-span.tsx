import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Handle, NodeProps, Position } from 'react-flow-renderer';

import LoggerModal from './log-modal';
import store from '../store';
import { FUNC_STATUS } from '../constants';

type NodeStatus = FaasProcessStatus | 'Disable';

const COLOR = {
  True: 'green',
  Unknown: 'yellow',
  False: 'red',
  Disable: 'gray',
};

function ProcessSpan({ data, id }: NodeProps<FaasProcessSpanProps>): JSX.Element {
  const [logVisible, setLogVisible] = useState(false);
  const status = getState();
  function getState(): NodeStatus {
    if (!store.currentVersionFunc?.status) return 'Disable';
    if (store.currentVersionFunc?.status < FUNC_STATUS.StatusFailed) return 'Disable';
    if (store.currentVersionFunc?.status === FUNC_STATUS.StatusFailed) return 'False';
    return 'True';
  }

  return (
    <>
      {
        !data.isStart && (
          <Handle
            type="target"
            position={(data.isChildNode ? 'top' : 'left') as Position}
            style={{ background: '#555' }}
            isConnectable={false}
          />
        )
      }
      <div
        style={{
          '--theme-color': `var(--${COLOR[status]}-600)`,
        } as React.CSSProperties}
        className='bg-white faas-build-process-span overflow-hidden px-12 py-6 flex items-center'
        onClick={() => setLogVisible(true)}
      >
        {data.title}
        {status === 'Unknown' && (
          <img
            src='/dist/images/loading.svg'
            className='ml-10'
            alt="loading"
            style={{ width: 16, height: 16 }}
          />
        )}
      </div>
      {
        !data.isEnd && (
          <Handle
            type="source"
            position={(data.isChildNode ? 'bottom' : 'right') as Position}
            style={{ background: '#555' }}
            isConnectable={false}
          />
        )
      }
      {
        logVisible && (
          <LoggerModal
            isChild={data.isChildNode}
            isOngoing={status === 'Unknown' || !status}
            step={id}
            onClose={() => setLogVisible(false)}
          />
        )
      }
    </>
  );
}

export default observer(ProcessSpan);
