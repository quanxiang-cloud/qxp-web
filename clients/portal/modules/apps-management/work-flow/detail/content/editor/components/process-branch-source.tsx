import React from 'react';
import cs from 'classnames';
import { FlowElement } from 'react-flow-renderer';

import { uuid, deepClone } from '@lib/utils';
import store, { updateStore } from '@flowEditor/store';
import type { Data } from '@flowEditor/type';

import { Props } from './node-component-wrapper';
import { edgeBuilder, nodeBuilder } from '../utils';

export default function ProcessBranchSourceNodeComponent(props: Props): JSX.Element {
  const { data, id } = props;
  const { nodeData } = data;

  function onAddBranch(): void {
    const elements = deepClone(store.value.elements) as FlowElement<Data>[];
    const { branchTargetElementID } = nodeData;
    if (!branchTargetElementID) {
      return;
    }
    const newBranchNodeID = `processBranch${uuid()}`;
    const newBranchNode = nodeBuilder(newBranchNodeID, 'processBranch', '筛选条件设置', {
      parentID: [id],
      childrenID: [branchTargetElementID],
      branchTargetElementID,
    });
    const sourceElement = elements.find((el) => el.id === id);
    const targetElement = elements.find((el) => el.id === branchTargetElementID);
    sourceElement?.data?.nodeData.childrenID?.push(newBranchNodeID);
    targetElement?.data?.nodeData.parentID?.push(newBranchNodeID);
    const newBranchEdge = edgeBuilder(id, newBranchNodeID, 'step', '');
    const newProcessTargetEdge = edgeBuilder(newBranchNodeID, branchTargetElementID);
    const newElements = [
      ...elements,
      newBranchNode,
      newBranchEdge,
      newProcessTargetEdge,
    ];
    updateStore((s) => ({ ...s, elements: newElements }));
  }

  return (
    <div
      className={cs(
        'shadow-title rounded-tl-8 rounded-tr-8 rounded-br-2',
        'rounded-bl-8 bg-white flex flex-col border relative cursor-pointer',
      )}
      style={{
        width: nodeData.width,
        height: nodeData.height,
      }}
    >
      <div
        className="h-full flex items-center justify-center whitespace-nowrap p-1"
        onClick={onAddBranch}
      >
        分流+
      </div>
    </div>
  );
}
