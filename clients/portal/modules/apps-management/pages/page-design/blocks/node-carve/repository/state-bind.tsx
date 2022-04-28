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

function ConfigItemBind({
  path,
  isSetLoopNode = false,
}: ConnectedProps<any>): JSX.Element {
  const {
    rawActiveNode,
    activeNode,
    artery,
    onArteryChange,
    setNodeAttr,
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
    const typePath = `${path}.type`;
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
      const { fallback } = get(activeNode, path, {});
      onArteryChange(
        updateNodeProperty(
          activeNode,
          path,
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
    setNodeAttr({ path, type: isSetLoopNode ? 'loopNode' : 'normal' });
    if (exportName === 'container' && isSetLoopNode) {
      setModalComponentNodeOpen(true);
    } else {
      setModalBindStateOpen(true);
    }
  }

  return (
    <div className="inline-flex items-center">
      <Tooltip position="top" label={bound ? '编辑绑定' : '绑定变量'}>
        <Icon
          name="code"
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
