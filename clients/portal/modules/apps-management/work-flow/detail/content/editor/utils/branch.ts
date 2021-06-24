import {
  XYPosition,
  Elements,
} from 'react-flow-renderer';

import { uuid } from '@lib/utils';

import { nodeBuilder, edgeBuilder } from './index';

export function buildBranchNodes(
  source: string,
  target: string,
  position: XYPosition,
  width: number,
  height: number,
): { elements: Elements, sourceID: string; targetID: string } {
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
    });
  const branchSourceElementEdge = edgeBuilder(source, branchSourceElementID);
  const branchLeftFilterElement = nodeBuilder(
    branchLeftFilterElementID, 'processBranch', '筛选条件设置', {
      position: { x: position.x - (width / 2) - 72, y: position.y - (height / 2) },
      width,
      height,
      parentID: [branchSourceElementID],
      childrenID: [branchTargetElementID],
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
