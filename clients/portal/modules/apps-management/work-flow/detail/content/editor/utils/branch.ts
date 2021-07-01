import {
  XYPosition,
  Elements,
  Node,
} from 'react-flow-renderer';

import { uuid } from '@lib/utils';

import { getNodeElementById } from '../store';
import { nodeBuilder } from './node';
import { edgeBuilder } from './edge';
import { CurrentElement, Data } from '../type';

export function getBranchTargetElementID(
  sourceElement: CurrentElement,
  targetElement: CurrentElement,
): string | undefined {
  if (targetElement.type === 'processBranchTarget') {
    return targetElement.id;
  }
  if (targetElement.type === 'processBranchSource') {
    return targetElement.data.nodeData.parentBranchTargetElementID;
  }
  return sourceElement.data.nodeData.branchTargetElementID ||
    targetElement.data.nodeData.branchTargetElementID;
}

export function buildBranchNodes(
  source: string,
  target: string,
  position: XYPosition,
  width: number,
  height: number,
): { elements: Elements, sourceID: string; targetID: string } {
  const sourceElement = getNodeElementById(source);
  const targetElement = getNodeElementById(target);
  const branchID = getBranchID(sourceElement, targetElement);
  const targetElementID = getBranchTargetElementID(sourceElement, targetElement);
  const branchSourceElementID = `processBranchSource${uuid()}`;
  const branchLeftFilterElementID = `processBranch${uuid()}`;
  const branchRightFilterElementID = `processBranch${uuid()}`;
  const branchTargetElementID = `processBranchTarget${uuid()}`;
  const branchSourceElement = nodeBuilder(
    branchSourceElementID, 'processBranchSource', '分流', {
      position: { x: position.x - 20, y: position.y - 72 - 20 },
      width: 50,
      height: 25,
      parentID: [source],
      childrenID: [branchLeftFilterElementID, branchRightFilterElementID],
      branchTargetElementID,
      branchID,
      parentBranchTargetElementID: targetElementID,
    },
  );
  const branchSourceElementEdge = edgeBuilder(source, branchSourceElementID);
  const branchLeftFilterElement = nodeBuilder(
    branchLeftFilterElementID, 'processBranch', '筛选条件设置', {
      position: { x: position.x - (width / 2) - 72, y: position.y - (height / 2) },
      width,
      height,
      parentID: [branchSourceElementID],
      childrenID: [branchTargetElementID],
      branchTargetElementID,
      branchID,
    },
  );
  const branchLeftFilterElementEdge = edgeBuilder(
    branchSourceElementID, branchLeftFilterElementID, 'step', '',
  );
  const branchRightFilterElement = nodeBuilder(
    branchRightFilterElementID, 'processBranch', '筛选条件设置', {
      position: { x: position.x - (width / 2) + 72, y: position.y - (height / 2) },
      width,
      height,
      parentID: [branchSourceElementID],
      childrenID: [branchTargetElementID],
      branchTargetElementID,
      branchID,
    },
  );
  const branchRightFilterElementEdge = edgeBuilder(
    branchSourceElementID, branchRightFilterElementID, 'step', '',
  );
  const branchTargetElement = nodeBuilder(
    branchTargetElementID, 'processBranchTarget', '合流', {
      position: { x: position.x - 20, y: position.y + 72 - 20 },
      width: 50,
      height: 25,
      parentID: [branchRightFilterElementID, branchLeftFilterElementID],
      childrenID: [target],
      branchTargetElementID: targetElementID,
      branchID,
    },
  );
  const branchTargetElementLeftEdge = edgeBuilder(
    branchLeftFilterElementID, branchTargetElementID,
  );
  const branchTargetElementRightEdge = edgeBuilder(
    branchRightFilterElementID, branchTargetElementID,
  );
  const branchEndEdge = edgeBuilder(branchTargetElementID, target);

  return {
    elements: [
      branchSourceElement,
      branchLeftFilterElement,
      branchRightFilterElement,
      branchTargetElement,
      branchEndEdge,
      branchSourceElementEdge,
      branchLeftFilterElementEdge,
      branchRightFilterElementEdge,
      branchTargetElementLeftEdge,
      branchTargetElementRightEdge,
    ],
    sourceID: branchSourceElementID,
    targetID: branchTargetElementID,
  };
}

export function getBranchID(sourceElement: Node<Data>, targetElement: Node<Data>): undefined | string {
  if (sourceElement.type === 'processBranch') {
    return sourceElement.id;
  }
  if (targetElement.type === 'processBranch') {
    return targetElement.id;
  }
  return sourceElement.data?.nodeData.branchID || targetElement.data?.nodeData.branchID;
}
