import React from 'react';
import cs from 'classnames';
import { get } from 'lodash';
import { Icon, Tooltip } from '@one-for-all/ui';
import type { NodePropType, ReactComponentNode } from '@one-for-all/artery';

import { ConfigContextState, useConfigContext } from '../context';
import { unsetComposedNode, unsetLoopNode, updateNodeProperty } from '../utils';
import { ConnectedProps } from '../utils/connect';

export const iterableStateTypes: NodePropType[] = [
  'shared_state_property',
  'api_result_property',
  'constant_property',
];

const normalStateTypes: NodePropType[] = [
  'shared_state_property',
  'api_result_property',
];

const tipsMap: Record<string, string> = {
  shouldRender: '渲染条件',
  'loop-node': '循环规则',
};

// todo remove
function getToolTips(path: string, bound: boolean): string {
  const text = tipsMap[`${path}`] ?? '变量';
  return bound ? `编辑${text}` : `配置${text}`;
}

function ConfigItemBind({
  __path,
  isSetLoopNode = false,
}: ConnectedProps<{
  isSetLoopNode?: boolean,
}>): JSX.Element {
  const {
    rawActiveNode,
    activeNode,
    artery,
    onArteryChange,
    setUpdateAttrPayload,
    setModalBindStateOpen,
    setModalComponentNodeOpen,
  } = useConfigContext() as ConfigContextState;
  const isLoopNode = rawActiveNode?.type === 'loop-container';
  const isComposedNode = isLoopNode && rawActiveNode?.node && rawActiveNode?.node.type === 'composed-node';
  let bound;
  if (isSetLoopNode) {
    // if bind constant value, loop node iterableState will be constant_property
    // if bind shared state, loop node iterableState will be shared_property
    // if bind api state, loop node iterableState will be api_result_property
    const iterType = get(rawActiveNode, 'iterableState.type');
    bound = iterableStateTypes.includes(iterType);
  } else {
    const typePath = `${__path}.type`;
    const propType = get(activeNode, typePath);
    bound = normalStateTypes.includes(propType);
  }

  function handleUnbind(): void {
    if (!activeNode) {
      return;
    }
    if (isLoopNode && !isComposedNode) {
      // replace loop node with inner normal node, detach iterable state prop
      onArteryChange(unsetLoopNode(activeNode, artery));
    } else if (isComposedNode) {
      onArteryChange(unsetComposedNode(activeNode, artery));
    } else {
      const { fallback } = get(activeNode, __path, {});
      onArteryChange(
        updateNodeProperty(
          activeNode,
          __path,
          {
            type: 'constant_property',
            value: fallback,
          },
          artery,
        ),
      );
    }
  }

  function handleClick(): void {
    const { exportName } = activeNode as ReactComponentNode;
    setUpdateAttrPayload({ path: __path, type: isSetLoopNode ? 'loopNode' : 'normal' });
    if (exportName === 'container' && isSetLoopNode) {
      setModalComponentNodeOpen(true);
    } else {
      setModalBindStateOpen(true);
    }
  }

  return (
    <div className="inline-flex items-center">
      <Tooltip
        position="top"
        label={getToolTips(__path, bound)}
      >
        <Icon
          name={['shouldRender', 'loop-node'].includes(__path) ? 'settings' : 'code'}
          color="gray"
          clickable
          onClick={handleClick}
          className={cs('mr-8', bound ? 'bg-blue-200' : '')}
        />
      </Tooltip>
      {bound && (
        <Tooltip position="top" label="解绑">
          <Icon
            name="link"
            clickable
            onClick={handleUnbind}
          />
        </Tooltip>
      )}
    </div>
  );
}

export default ConfigItemBind;
