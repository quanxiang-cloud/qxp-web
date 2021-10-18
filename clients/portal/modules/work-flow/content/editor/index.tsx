import React, { useState, DragEvent, useContext } from 'react';
import cs from 'classnames';
import { Elements, XYPosition, Node } from 'react-flow-renderer';

import useObservable from '@lib/hooks/use-observable';
import { uuid } from '@lib/utils';
import FlowRender from '@c/flow-render';
import FlowContext from '@flow/flow-context';

import Components from './components';
import store, { getNodeElementById, updateStore, getFormDataElement } from './store';
import type { StoreValue, NodeType, Data } from './type';
import DrawerForm from './forms';
import {
  nodeBuilder, buildBranchNodes, edgeBuilder, getCenterPosition, removeEdge,
  getBranchTargetElementID, getBranchID, prepareNodeData,
} from './utils';

import 'react-flow-renderer/dist/style.css';
import 'react-flow-renderer/dist/theme-default.css';

interface NodeInfo {
  nodeType: NodeType;
  nodeName: string;
  source: string;
  target: string;
  position: XYPosition;
  width: number;
  height: number;
}

export default function Editor(): JSX.Element {
  const { appID } = useContext(FlowContext);
  const { currentConnection, elements, nodeIdForDrawerForm } = useObservable<StoreValue>(store);
  const [fitViewFinished, setFitViewFinished] = useState(false);

  function setElements(eles: Elements): void {
    updateStore((s) => ({ ...s, elements: eles }));
  }

  async function addNewNode({
    nodeType, source, target, position, width, height, nodeName,
  }: NodeInfo): Promise<void> {
    const id = nodeType + uuid();
    const newElements: Elements = [...elements];
    const sourceElement = newElements.find(({ id }) => id === source) as Node<Data>;
    const targetElement = newElements.find(({ id }) => id === target) as Node<Data>;
    let sourceChildrenID = id;
    let targetParentID = id;
    if (nodeType === 'processBranch') {
      const {
        elements: nodes, sourceID, targetID,
      } = buildBranchNodes(source, target, position, width, height);
      sourceChildrenID = sourceID;
      targetParentID = targetID;
      newElements.push(...nodes);
    } else {
      const sourceElement = getNodeElementById(source);
      const targetElement = getNodeElementById(target);
      const branchTargetElementID = getBranchTargetElementID(sourceElement, targetElement);
      const newNode = nodeBuilder(id, nodeType, nodeName, {
        width,
        height,
        parentID: [source],
        childrenID: [target],
        branchID: getBranchID(sourceElement, targetElement),
        position: getCenterPosition(position, width, height),
        branchTargetElementID,
      });
      await prepareNodeData(newNode, {
        tableID: getFormDataElement()?.data?.businessData?.form?.value,
        appID,
      });
      newElements.push(newNode);
      newElements.push(...edgeBuilder(source, id));
      newElements.push(...edgeBuilder(id, target));
    }
    if (sourceElement.data?.nodeData.childrenID) {
      sourceElement.data.nodeData.childrenID = [
        ...sourceElement.data.nodeData.childrenID.filter((id) => id !== target),
        sourceChildrenID,
      ];
    }
    if (targetElement.data?.nodeData.parentID) {
      targetElement.data.nodeData.parentID = [
        ...targetElement.data.nodeData.parentID.filter((id) => id !== source),
        targetParentID,
      ];
    }
    setElements(removeEdge(newElements, source, target));
  }

  async function onDrop(e: DragEvent): Promise<void> {
    e.preventDefault();
    if (!e?.dataTransfer) {
      return;
    }
    const { nodeType, width, height, nodeName } = JSON.parse(
      e.dataTransfer.getData('application/reactflow'),
    );
    const { source, target, position } = currentConnection;
    if (!source || !target || !position) {
      return;
    }
    await addNewNode({ nodeType, width, height, nodeName, source, target, position });
    updateStore((s) => ({ ...s, currentConnection: {} }));
  }

  return (
    <div className={cs('w-full h-full flex-1 relative transition', {
      'opacity-0': !fitViewFinished,
    })}>
      <div className="reactflow-wrapper w-full h-full">
        <FlowRender
          elements={elements}
          onDrop={onDrop}
          setFitViewFinished={setFitViewFinished}
        />
      </div>
      <Components />
      {nodeIdForDrawerForm && (
        <DrawerForm key={nodeIdForDrawerForm} />
      )}
    </div>
  );
}
