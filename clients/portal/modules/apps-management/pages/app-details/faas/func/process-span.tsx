import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Handle, NodeProps, Position } from 'react-flow-renderer';

import LoggerModal from './log-modal';
import store from '../store';

type NodeStatus = FaasProcessStatus | 'Disable';

const COLOR = {
  True: 'green',
  Unknown: 'yellow',
  False: 'red',
  Disable: 'gray',
};

function ProcessSpan({ data, id }: NodeProps<FaasProcessSpanProps>): JSX.Element {
  const [logVisible, setLogVisible] = useState(false);
  let status: NodeStatus = id === 'start' ? 'True' : (store.buildStatusMap[id] || 'Disable');

  // 由于接口拿不到末尾节点的状态，因此需要更具上一个节点状态来做判断
  if (data.isEnd && !data.isChildNode) {
    const preNodeKey = store.buildSteps[store.buildSteps.length - 2];
    status = preNodeKey && store.buildStatusMap[preNodeKey] === 'True' ? 'True' : 'Disable';
  }

  const noLog = id === 'start' || id === 'push' || status === 'Disable';

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
        onClick={() => !noLog && setLogVisible(true)}
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
            step={id}
            onClose={() => setLogVisible(false)}
          />
        )
      }
    </>
  );
}

export default observer(ProcessSpan);
