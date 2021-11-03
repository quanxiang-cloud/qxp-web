import React from 'react';
import { NodeProps } from 'react-flow-renderer';
import cs from 'classnames';

import Icon from '@c/icon';
import useObservable from '@lib/hooks/use-observable';

import NodeWrapper from './wrapper';

export default function RequestNode(props: NodeProps<POLY_API.SubjectPolyNode>): JSX.Element | null {
  const nodeData = useObservable<POLY_API.PolyNode>(props.data);
  if (nodeData.type !== 'request') {
    return null;
  }
  const { apiName } = nodeData.detail;

  return (
    <NodeWrapper
      noPadding
      rightTrigger
      bottomTrigger
      {...props}
    >
      <div className="p-8">
        <div
          className={cs(
            'flex justify-between items-center flex-nowrap py-4 px-8 transition duration-300',
            'hover:bg-blue-100 border-1 border-solid border-gray-200 rounded-4',
          )}
        >
          <span className={cs(
            'text-caption-no-color-weight mr-80',
            { 'text-blue-600': !apiName },
          )}>
            {apiName || '配置请求节点'}
          </span>
          <Icon name="chevron_right" className={cs({ 'text-blue-600': !apiName })} />
        </div>
      </div>
    </NodeWrapper>
  );
}
