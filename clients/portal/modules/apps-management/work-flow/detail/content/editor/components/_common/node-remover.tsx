import React, { useState, MouseEvent } from 'react';
import cs from 'classnames';
import { flatMap } from 'lodash';
import { usePopper } from 'react-popper';
import { removeElements, FlowElement, Edge, isNode } from 'react-flow-renderer';

import Icon from '@c/icon';
import store, { updateStore } from '@flowEditor/store';
import type { StoreValue, Data } from '@flowEditor/type';
import useObservable from '@lib/hooks/use-observable';
import { edgeBuilder } from '@flowEditor/utils';

import ActionButtonGroup from './action-button-group';

interface Props {
  id: string;
  type?: 'dark' | 'primary' | 'light';
  visible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
}

export default function NodeRemover({
  id, type = 'dark', visible = true, onVisibilityChange,
}: Props): JSX.Element | null {
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const { status, elements } = useObservable<StoreValue>(store);
  const [referenceElRef, setReferenceElRef] = useState(null);
  const [popperElRef, setPopperElRef] = useState(null);
  const popperRef = usePopper(referenceElRef, popperElRef, {
    modifiers: [{ name: 'offset', options: { offset: [-18, 0] } }],
    placement: 'bottom-start',
  });

  function getBranchTargetParentID(
    branchEl: FlowElement<Data>,
    branchTargetElementID?: string,
  ): string | undefined {
    if (!branchTargetElementID) {
      return;
    }
    if (branchEl.data?.nodeData.childrenID?.includes(branchTargetElementID)) {
      return branchEl.id;
    }
    const children = elements.filter(({ id }) => branchEl.data?.nodeData.childrenID?.includes(id));
    const el = children.find((e) => e.data?.nodeData?.childrenID?.includes?.(branchTargetElementID));
    if (el) {
      return el.id;
    }
    return children.map((child) => {
      return getBranchTargetParentID(child, branchTargetElementID);
    }).find((i) => !!i);
  }

  function getBranchNodes(branchID: string): FlowElement<Data>[] {
    const currentLevelElements = elements.filter((ele) => {
      return ele.data?.nodeData.branchID === branchID;
    });
    const branchElements: FlowElement<Data>[] = currentLevelElements.filter((ele) => {
      if (ele.type === 'processBranch' && ele.id !== branchID) {
        return ele;
      }
    });
    const nodes = flatMap(branchElements, (ele) => getBranchNodes(ele.id));
    return currentLevelElements.concat(nodes);
  }

  function onRemoveBranchNodes(
    el: FlowElement<Data>,
    elementsToRemove: FlowElement<Data>[],
    edgesToAdd: Edge<Data>[],
  ): FlowElement<Data>[] {
    elementsToRemove.push(...getBranchNodes(el.id));
    const sourceElement = elements.find(({ id }) => el.data?.nodeData?.parentID?.includes(id));
    const targetElement = elements.find(({ id }) => {
      return sourceElement?.data?.nodeData?.branchTargetElementID === id;
    });
    let sourceElementFilteredChildrenID: string[] | undefined;
    let targetElementFilteredParentID: string[] | undefined;
    if (sourceElement?.data) {
      sourceElementFilteredChildrenID = sourceElement.data.nodeData.childrenID?.filter(
        (cid) => cid !== el.id,
      );
    }
    const targetElementParentID = getBranchTargetParentID(el, targetElement?.id);
    const targetElementParentElement = elements.find((ele) => ele.id === targetElementParentID);
    if (targetElement?.data) {
      targetElementFilteredParentID = targetElement.data.nodeData.parentID?.filter(
        (pid) => pid !== targetElementParentID,
      );
    }
    const isSourceRemove = !!(sourceElementFilteredChildrenID?.length === 1);
    const isTargetRemove = !!(targetElementFilteredParentID?.length === 1);
    sourceElement && isSourceRemove && elementsToRemove.push(sourceElement);
    targetElement && isTargetRemove && elementsToRemove.push(targetElement);
    if (sourceElement && targetElement && isSourceRemove && isTargetRemove) {
      const sourceParentID = sourceElement.data?.nodeData?.parentID?.[0];
      const sourceChildID = sourceElementFilteredChildrenID?.[0];
      const targetParentID = targetElementFilteredParentID?.[0];
      const targetChildID = targetElement.data?.nodeData?.childrenID?.[0];
      if (sourceParentID && targetParentID && sourceChildID && targetChildID) {
        edgesToAdd.push(
          edgeBuilder(sourceParentID, sourceChildID),
          edgeBuilder(targetParentID, targetChildID),
        );
      }
    }
    const nodesNeedRemoveAssociation: FlowElement<Data>[] = [el];
    targetElementParentElement && targetElementParentElement.id !== el.id &&
      nodesNeedRemoveAssociation.push(targetElementParentElement);
    // handle single branch to remove
    if (sourceElement?.data?.nodeData.childrenID?.length === 1 &&
      sourceElement.type !== 'processBranchSource') {
      const elementsToRemoveIDs = elementsToRemove.map(({ id }) => id);
      const blockedTypes = ['processBranch', 'processBranchTarget'];
      const branchTargetElements = elements.filter((el) => {
        return el.type && !el.data?.nodeData.branchID && !blockedTypes.includes(el.type) &&
        el?.data?.nodeData.parentID?.some((id) => {
          return elementsToRemoveIDs.includes(id);
        });
      });
      branchTargetElements.map((tel) => {
        edgesToAdd.push(
          edgeBuilder(
            sourceElement.id,
            tel.id,
          ),
        );
      });
    }
    if (isSourceRemove && isTargetRemove && sourceElement && targetElement) {
      nodesNeedRemoveAssociation.push(sourceElement, targetElement);
    }
    return nodesNeedRemoveAssociation;
  }

  function onRemoveMultipleNodeAssociation(
    eles: FlowElement<Data>[],
    nodes: FlowElement<Data>[],
  ): FlowElement<Data>[] {
    return nodes.reduce((elements, nextNode) => {
      return onRemoveSingleNodeAssociation(elements, nextNode);
    }, eles);
  }

  function onRemoveSingleNode(
    el: FlowElement<Data>,
    edgesToAdd: Edge<Data>[],
  ): void {
    const sourceID = el.data?.nodeData.parentID?.[0];
    const targetID = el.data?.nodeData.childrenID?.[0];
    if (!sourceID || !targetID) {
      return;
    }
    edgesToAdd.push(edgeBuilder(sourceID, targetID));
  }

  function idExistsOnElements(eles: FlowElement<Data>[]) {
    return (id: string) => {
      return eles.find((ele) => ele.id === id);
    };
  }

  function onRemoveSingleNodeAssociation(
    eles: FlowElement<Data>[],
    node: FlowElement<Data>,
  ): FlowElement<Data>[] {
    return eles.map((el) => {
      if (!isNode(el)) {
        return el;
      }
      const removedNodeParentID = node.data?.nodeData.parentID;
      const removedNodeChildID = node.data?.nodeData.childrenID;
      const { nodeData } = el.data || {};
      if (nodeData?.parentID?.includes(node.id || '')) {
        nodeData.parentID = nodeData.parentID.filter((id) => {
          return id !== node.id;
        });
        if (removedNodeParentID && !(node.type === 'processBranch' && el.type === 'processBranchTarget')) {
          nodeData.parentID.push(...removedNodeParentID.filter(idExistsOnElements(eles)));
        }
      }
      if (nodeData?.childrenID?.includes(node.id || '')) {
        nodeData.childrenID = nodeData.childrenID.filter((id) => {
          return id !== node.id;
        });
        if (removedNodeChildID && !(node.type === 'processBranch' && el.type === 'processBranchSource')) {
          nodeData.childrenID.push(...removedNodeChildID.filter(idExistsOnElements(eles)));
        }
      }
      return el;
    });
  }

  function onRemoveNode(): void {
    const el = elements.find((i) => i.id === id);
    if (!el) {
      return;
    }
    const elementsToRemove = [el];
    const isProcessBranch = el.type === 'processBranch';
    const edgesToAdd: Edge<Data>[] = [];
    if (isProcessBranch) {
      let sourceAndTargetToRemoved: FlowElement<Data>[] = [];
      sourceAndTargetToRemoved = onRemoveBranchNodes(el, elementsToRemove, edgesToAdd);
      return updateStore((s) => ({
        ...s,
        elements: [
          ...edgesToAdd,
          ...onRemoveMultipleNodeAssociation(
            removeElements(elementsToRemove, elements),
            sourceAndTargetToRemoved,
          ),
        ],
      }));
    }
    onRemoveSingleNode(el, edgesToAdd);
    updateStore((s) => ({
      ...s,
      elements: [
        ...edgesToAdd,
        ...onRemoveSingleNodeAssociation(
          removeElements(elementsToRemove, elements),
          el,
        ),
      ],
    }));
  }

  function onMouseDown(e: MouseEvent): void {
    e.stopPropagation();
  }

  function onMouseUp(e: MouseEvent): void {
    e.stopPropagation();
  }

  function onShowRemovePopper(e: MouseEvent<SVGSVGElement>): void {
    e.stopPropagation();
    setShowRemoveModal(true);
  }

  function onClosePopper(): void {
    onVisibilityChange && onVisibilityChange(false);
    setShowRemoveModal(false);
  }

  if (status === 'ENABLE') {
    return null;
  }

  const shouldShow = visible || showRemoveModal;

  return (
    <>
      <Icon
        name="close"
        className={cs('transition-all absolute right-6 top-1/2 transform -translate-y-1/2', {
          'cursor-default': !shouldShow,
          'pointer-events-none': !shouldShow,
          'opacity-0': !shouldShow,
          'opacity-1': shouldShow,
          'cursor-pointer': shouldShow,
        })}
        type={type}
        onClick={onShowRemovePopper}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        ref={setReferenceElRef as any}
      />
      {showRemoveModal && (
        <div
          {...popperRef.attributes.popper}
          style={{
            ...popperRef.styles.popper,
            transform: 'none',
            left: 'calc(100% - 20px)',
            top: 25,
            boxShadow: '0 0 30px rgba(200, 200, 200, .7)',
          }}
          ref={setPopperElRef as any}
          className="bg-white z-50 rounded-8"
        >
          <div
            key="remove-tip"
            className="mb-16 pl-12 pt-12"
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
          >
            <Icon name="info" className="text-yellow-600" />
            <span className="text-yellow-600 ml-8">是否删除该节点</span>
          </div>
          <div
            className="pl-16"
            key="remove-action"
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
          >
            <ActionButtonGroup
              className="p-0"
              onCancel={onClosePopper}
              onSubmit={onRemoveNode}
            />
          </div>
        </div>
      )}
    </>
  );
}
