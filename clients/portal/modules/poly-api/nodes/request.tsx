import React from 'react';
import { NodeProps } from 'react-flow-renderer';
import cs from 'classnames';

import NodeWrapper from './wrapper';
import RightHandle from './handle/right';
import LeftHandle from './handle/left';
import TopHandle from './handle/top';
import BottomHandle from './handle/bottom';

import Icon from '@c/icon';

export default function RequestNode(props: NodeProps<POLY_API.PolyNode>): JSX.Element | null {
  if (props.data.detail?.type !== 'request') {
    return null;
  }
  const nodeName = props.data.title ?? '未命名节点';
  const { handles } = props.data;
  const { apiName } = props.data.detail.data;

  return (
    <>
      <LeftHandle id={handles.left} />
      <TopHandle id={handles.top} />
      <NodeWrapper noPadding rightTrigger bottomTrigger isSelected={props.selected}>
        <div className="py-6 px-12 bg-gray-50 flex items-center self-stretch rounded-t-8">
          <Icon className="mr-4 rounded-4" name="request-node" />
          <span className="text-caption-no-weight">{nodeName}</span>
        </div>
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
      <RightHandle id={handles.right} />
      <BottomHandle id={handles.bottom} />
    </>
  );
}
