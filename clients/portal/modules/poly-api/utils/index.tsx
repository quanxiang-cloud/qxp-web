import React, { MutableRefObject, Ref } from 'react';
import { Edge, isEdge, removeElements } from 'react-flow-renderer';
import { ifElse, flatten } from 'ramda';
import { fromEvent, of, Subscription } from 'rxjs';
import { map, mergeAll } from 'rxjs/operators';
import { customAlphabet } from 'nanoid';

import { not } from '@lib/utils';

import { POLY_DESIGN_CONFIG } from '../constants';
import { PolyNodeStore } from '../store/node';
import layout from './layout';
import store$ from '../store';

interface BuildEdgeOption {
  direction?: 'right' | 'bottom';
  label?: string;
  sourceHandle?: string;
  targetHandle?: string;
}

const first = customAlphabet('qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM', 1);
const _nanoid = customAlphabet('1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM', 7);
function nanoid(): string {
  return `${first()}${_nanoid()}`;
}

export function buildEdge(
  source: string,
  target: string,
  {
    direction, label, sourceHandle, targetHandle,
  }: BuildEdgeOption = { direction: 'right' },
): POLY_API.EdgeElement {
  const sourceHandleI = sourceHandle || (direction === 'right' ? `${source}__right` : `${source}__bottom`);
  const targetHandleI = targetHandle || (direction === 'right' ? `${target}__left` : `${target}__top`);
  function getEdge(): Edge {
    return {
      id: `e${source}-${target}-${nanoid()}`, source, target,
      type: POLY_DESIGN_CONFIG.EDGE_TYPE,
      style: { stroke: POLY_DESIGN_CONFIG.EDGE_COLOR },
      arrowHeadType: POLY_DESIGN_CONFIG.ARROW_HEAD_TYPE,
      sourceHandle: sourceHandleI,
      targetHandle: targetHandleI,
    };
  }
  function getConditionEdge(label: string): Edge {
    return {
      ...getEdge(),
      label,
      labelShowBg: true,
      labelBgStyle: { fill: POLY_DESIGN_CONFIG.BACKGROUND_COLOR },
    };
  }
  const predicate = ifElse(Boolean, getConditionEdge, getEdge);
  return predicate(label);
}

export function buildInputNode(): POLY_API.NodeElement {
  return {
    id: 'start',
    type: 'input',
    data: new PolyNodeStore({
      title: '',
      name: 'start',
      type: 'input',
      nextNodes: [],
      detail: { inputs: [], consts: [] },
      handles: { right: 'start__right' },
    }),
    position: { x: 0, y: 0 },
  };
}

export function buildRequestNode(): POLY_API.NodeElement {
  const id = nanoid();
  return {
    id,
    type: 'request',
    data: new PolyNodeStore({
      title: '未命名节点',
      name: id,
      type: 'request',
      nextNodes: [],
      detail: {
        rawPath: '',
        apiName: '',
        inputs: [],
      },
      handles: { top: `${id}__top`, left: `${id}__left`, right: `${id}__right`, bottom: `${id}__bottom` },
    }),
    position: { x: 0, y: 0 },
  };
}

export function buildConditionNode(): POLY_API.NodeElement {
  const id = nanoid();
  return {
    id,
    type: 'if',
    data: new PolyNodeStore({
      title: '',
      name: id,
      type: 'if',
      nextNodes: [],
      detail: {
        cond: {
          type: 'direct_expr',
          data: '',
        },
        yes: '',
        no: '',
      },
      handles: { top: `${id}__top`, left: `${id}__left`, right: `${id}__right`, bottom: `${id}__bottom` },
    }),
    position: { x: 0, y: 0 },
  };
}

export function buildEndNode(): POLY_API.NodeElement {
  return {
    id: 'end',
    type: 'output',
    data: new PolyNodeStore({
      title: '',
      name: 'end',
      type: 'output',
      nextNodes: [],
      detail: {
        body: {
          type: 'object',
          data: [],
        },
      },
      handles: { left: 'end__left' },
    }),
    position: { x: 0, y: 0 },
  };
}

export function initGraphElements(): POLY_API.Element[] {
  const inputNode = buildInputNode();
  const requestNode = buildRequestNode();
  if (inputNode.data) {
    inputNode.data.set('nextNodes', [requestNode.id]);
  }
  const endNode = buildEndNode();
  if (requestNode.data) {
    requestNode.data.set('nextNodes', [endNode.id]);
  }
  const irEdge = buildEdge(inputNode.id, requestNode.id);
  const reEdge = buildEdge(requestNode.id, endNode.id);
  return [inputNode, requestNode, endNode, irEdge, reEdge];
}

interface SubScribeEventParams {
  els: (HTMLElement | null)[];
  types: string[];
  handler: (e: Event) => void;
}
export function subscribeEvents({ els, types, handler }: SubScribeEventParams): Subscription[] {
  return els.filter(Boolean).map((el: HTMLElement | null) => {
    return of(...types).pipe(
      map((type) => fromEvent(el as HTMLElement, type)),
      mergeAll(),
    ).subscribe(handler);
  });
}

export function unSubscribeSubscriptions(...subs: Subscription[]): void {
  subs.forEach((sub) => sub.unsubscribe());
}

export function isSomeActionShow(el: HTMLElement | null): boolean {
  if (!el) {
    return false;
  }
  const actions = Array.from(el.querySelectorAll('.node-actions'));
  return actions.some((action) => (action as HTMLElement).style.opacity === '1');
}

export function mergeRefs<T>(...refs: Array<MutableRefObject<T> | Ref<T>>): React.Ref<T> {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as MutableRefObject<T>).current = node;
      }
    });
  };
}

export async function layoutPolyCanvas(
  nodes: POLY_API.NodeElement[], edges: POLY_API.EdgeElement[],
): Promise<void> {
  const layoutResult = await layout(nodes, edges);
  store$.value.nodes.set(layoutResult);
}

export function elementsToMap(
  elements: POLY_API.Element[], effect?: (element: POLY_API.Element) => void,
): Record<string, POLY_API.Element> {
  const elementIDMap = elements.reduce((acc: Record<string, POLY_API.Element>, element) => {
    effect?.(element);
    acc[element.id] = element;
    return acc;
  }, {});
  return elementIDMap;
}

function removeCurrentRequestNodeFromRequestToRequestOrCondition(
  parent: POLY_API.NodeElement,
  current: POLY_API.NodeElement,
  next: POLY_API.NodeElement,
  elements: POLY_API.Element[],
): POLY_API.Element[] {
  const parentPreviousNextNodeIds = parent.data?.get<string[]>('nextNodes') || [];
  const isParentPreviousMultipleChild = parentPreviousNextNodeIds.length > 1;
  const edges = isParentPreviousMultipleChild ? [] : [buildEdge(parent.id, next.id)];
  parent.data?.set(
    'nextNodes',
    !isParentPreviousMultipleChild ? [next.id] : parentPreviousNextNodeIds.filter((id) => id !== current.id),
  );
  const newElements = removeElements([current], elements);
  return newElements.concat(edges);
}

function removeCurrentRequestNodeFromConditionToRequest(
  parent: POLY_API.NodeElement,
  current: POLY_API.NodeElement,
  next: POLY_API.NodeElement,
  elements: POLY_API.Element[],
): POLY_API.Element[] {
  const isYes = parent.data?.get('detail.yes') === current.id;
  const isNo = parent.data?.get('detail.no') === current.id;

  const edgesToAdd = [];
  isYes && edgesToAdd.push(buildEdge(parent.id, next.id, { label: '是' }));
  isNo && edgesToAdd.push(buildEdge(
    parent.id,
    next.id,
    { sourceHandle: `${parent.id}__bottom`, targetHandle: `${next.id}__left`, label: '否' },
  ));
  isYes && parent.data?.set('detail.yes', next.id);
  isNo && parent.data?.set('detail.no', next.id);

  const parentPreviousNextNodeIds = parent.data?.get<string[]>('nextNodes') || [];
  parent.data?.set(
    'nextNodes',
    parentPreviousNextNodeIds.filter((id) => ![current.id, next.id].includes(id)).concat([next.id]),
  );
  const newElements = removeElements([current], elements);

  return newElements.concat(edgesToAdd);
}

function getCurrentNodeParentNode(
  current: POLY_API.NodeElement, elements: POLY_API.Element[],
): POLY_API.NodeElement | undefined {
  return elements.find((element) => {
    const elementNextNodeIds = element.data?.get<string[]>('nextNodes') || [];
    return elementNextNodeIds.includes(current.id);
  }) as POLY_API.NodeElement | undefined;
}

function removeCurrentRequestNode(
  nodeToRemove: POLY_API.NodeElement, elements: POLY_API.Element[],
): POLY_API.Element[] {
  const currentNodeParentNode = getCurrentNodeParentNode(nodeToRemove, elements);
  const currentNodeNextNodeId = nodeToRemove.data?.get<string>('nextNodes')?.[0];
  const currentNodeNextNode = elements.find(
    (element) => element.id === currentNodeNextNodeId,
  ) as POLY_API.NodeElement | undefined;
  if (!currentNodeNextNode?.type || !currentNodeParentNode?.type) {
    return elements;
  }
  const belongsToRequest = ['request', 'input', 'output'];
  if (
    belongsToRequest.includes(currentNodeParentNode.type) &&
    [...belongsToRequest, 'if'].includes(currentNodeNextNode.type)
  ) {
    return removeCurrentRequestNodeFromRequestToRequestOrCondition(
      currentNodeParentNode, nodeToRemove, currentNodeNextNode, elements,
    );
  }

  if (currentNodeParentNode.type === 'if' && belongsToRequest.includes(currentNodeNextNode.type)) {
    return removeCurrentRequestNodeFromConditionToRequest(
      currentNodeParentNode, nodeToRemove, currentNodeNextNode, elements,
    );
  }

  return elements;
}

function getDescendantNodes(
  current: POLY_API.NodeElement,
  elements: POLY_API.Element[],
  filter?: (element: POLY_API.Element) => boolean,
): POLY_API.NodeElement[] {
  const currentNodeNextNodeIds = current.data?.get<string[]>('nextNodes') || [];
  if (!currentNodeNextNodeIds.length) {
    return [];
  }
  const elementsMap = elementsToMap(elements);
  const allNodes = currentNodeNextNodeIds.map((id) => {
    const element = elementsMap[id] as POLY_API.NodeElement;
    if (filter && !filter?.(element)) {
      return [];
    }
    return [element].concat(getDescendantNodes(element, elements, filter));
  });
  return flatten(allNodes);
}

function endFilter(element: POLY_API.Element): boolean {
  return element.type === 'output';
}

function removeCurrentConditionNode(
  nodeToRemove: POLY_API.NodeElement, elements: POLY_API.Element[],
): POLY_API.Element[] {
  const currentNodeParentNode = getCurrentNodeParentNode(nodeToRemove, elements);
  const descendantNodes = getDescendantNodes(nodeToRemove, elements, not(endFilter));
  const endNode = elements.find(endFilter) as POLY_API.NodeElement | undefined;
  if (!currentNodeParentNode || !endNode) {
    return elements;
  }
  const isParentInput = currentNodeParentNode.type === 'input';
  const isParentInputMultipleChild = isParentInput && (currentNodeParentNode.data?.get<string[]>(
    'nextNodes',
  ) || []).length > 1;
  const currentNodeParentNodeNextNodeIds = currentNodeParentNode.data?.get<string[]>('nextNodes') || [];
  currentNodeParentNode.data?.set(
    'nextNodes',
    !isParentInputMultipleChild ?
      [endNode.id] :
      currentNodeParentNodeNextNodeIds.filter((id) => id !== nodeToRemove.id),
  );
  const edges = isParentInputMultipleChild ? [] : [buildEdge(currentNodeParentNode.id, endNode.id)];
  const newElements = removeElements([...descendantNodes, nodeToRemove], elements);
  return newElements.concat(edges);
}

type RemoveNodeStrategy = Record<
  'if' | 'request', (nodeToRemove: POLY_API.NodeElement, elements: POLY_API.Element[]) => POLY_API.Element[]
>;
export function removeNode(
  nodeToRemove: POLY_API.NodeElement, elements: POLY_API.Element[],
): POLY_API.Element[] {
  const removeNodeStrategy: RemoveNodeStrategy = {
    request: removeCurrentRequestNode,
    if: removeCurrentConditionNode,
  };
  if (nodeToRemove.type !== 'if' && nodeToRemove.type !== 'request') {
    return elements;
  }
  const strategy = removeNodeStrategy[nodeToRemove.type];
  return strategy(nodeToRemove, elements);
}

function addRequestNodeOnBottom(
  requestNode: POLY_API.Element, elements: POLY_API.Element[],
): POLY_API.Element[] {
  const inputNode = elements.find((element) => element.type === 'input') as POLY_API.NodeElement | undefined;
  const endNode = elements.find(endFilter) as POLY_API.NodeElement | undefined;
  if (!inputNode || !endNode) {
    return elements;
  }
  const inputNodeNextNodeIds = inputNode.data?.get<string[]>('nextNodes') || [];
  inputNode.data?.set('nextNodes', [...inputNodeNextNodeIds, requestNode.id]);
  requestNode.data?.set('nextNodes', [endNode.id]);

  return elements.concat([
    buildEdge(inputNode.id, requestNode.id), buildEdge(requestNode.id, endNode.id), requestNode,
  ]);
}

function addRequestNodeOnRight(
  currentNode: POLY_API.NodeElement, requestNode: POLY_API.NodeElement, elements: POLY_API.Element[],
): POLY_API.Element[] {
  const currentNodeNextNodeIds = currentNode.data?.get<string[]>('nextNodes') || [];
  if (currentNodeNextNodeIds.length > 1) {
    return addRequestNodeOnBottom(requestNode, elements);
  }
  const currentNodeNextNodeId = currentNodeNextNodeIds[0];
  const currentNodeNextNode = elements.find(
    (element) => element.id === currentNodeNextNodeId,
  ) as POLY_API.NodeElement | undefined;
  if (!currentNodeNextNode) {
    return elements;
  }

  const edges = [
    buildEdge(currentNode.id, requestNode.id),
    buildEdge(requestNode.id, currentNodeNextNode.id),
  ];
  currentNode.data?.set('nextNodes', [requestNode.id]);
  requestNode.data?.set('nextNodes', [currentNodeNextNode.id]);

  return elements.filter((element) => {
    const shouldRemove = isEdge(element) && element.source === currentNode.id &&
      element.target === currentNodeNextNode.id;
    return !shouldRemove;
  }).concat([...edges, requestNode]);
}

function addRequestNodeOnCondition(
  currentNode: POLY_API.NodeElement,
  requestNode: POLY_API.NodeElement,
  elements: POLY_API.Element[],
  direction: 'right' | 'bottom',
): POLY_API.Element[] {
  let yesOrNo;
  if (direction === 'right') {
    yesOrNo = 'yes';
  }
  if (direction === 'bottom') {
    yesOrNo = 'no';
  }
  const currentNodeNextNodeId = currentNode.data?.get<string | undefined>(`detail.${yesOrNo}`);
  if (!currentNodeNextNodeId) {
    return elements;
  }
  const previousNextNodeIds = currentNode.data?.get<string[]>('nextNodes') || [];
  const currentNewNextNodes = previousNextNodeIds.filter((id) => id !== currentNodeNextNodeId);
  currentNode.data?.set('nextNodes', [requestNode.id, ...currentNewNextNodes]);
  requestNode.data?.set('nextNodes', [currentNodeNextNodeId]);

  const edges = [
    buildEdge(
      currentNode.id,
      requestNode.id,
      {
        sourceHandle: `${currentNode.id}__${direction}`,
        targetHandle: `${requestNode.id}__left`,
        label: direction === 'right' ? '是' : '否',
      },
    ),
    buildEdge(requestNode.id, currentNodeNextNodeId, { direction: 'right' }),
  ];

  direction === 'right' && currentNode.data?.set('detail.yes', requestNode.id);
  direction === 'bottom' && currentNode.data?.set('detail.no', requestNode.id);

  return elements.filter((element) => {
    const shouldRemove = isEdge(element) && element.sourceHandle === `${currentNode.id}__${direction}` &&
      element.targetHandle === `${currentNodeNextNodeId}__left`;
    return !shouldRemove;
  }).concat([
    ...edges,
    requestNode,
  ]);
}

function addConditionNodeOnRequest(
  currentNode: POLY_API.NodeElement,
  conditionNode: POLY_API.NodeElement,
  elements: POLY_API.Element[],
  direction: 'right' | 'bottom',
): POLY_API.Element[] {
  const currentNodeNextNodeIds = currentNode.data?.get<string[]>('nextNodes') || [];
  const isCurrentNodeNextNodeMultipleChild = currentNodeNextNodeIds.length > 1;
  const endNode = elements.find(endFilter) as POLY_API.NodeElement | undefined;
  const currentNodeNextNodeId = isCurrentNodeNextNodeMultipleChild ? endNode?.id : currentNodeNextNodeIds[0];
  if (!currentNodeNextNodeId) {
    return elements;
  }

  conditionNode.data?.set('nextNodes', [currentNodeNextNodeId]);
  conditionNode.data?.set('detail.yes', currentNodeNextNodeId);
  conditionNode.data?.set('detail.no', currentNodeNextNodeId);
  // currentNode.data?.set(
  //   'nextNodes', [conditionNode.id, ...currentNodeNextNodeIds.filter((id) => id !== conditionNode.id)],
  // );
  currentNode.data?.set(
    'nextNodes', [conditionNode.id],
  );

  const edges = [
    buildEdge(currentNode.id, conditionNode.id, {
      sourceHandle: `${currentNode.id}__${direction}`,
      targetHandle: `${conditionNode.id}__left`,
    }),
    buildEdge(
      conditionNode.id,
      currentNodeNextNodeId,
      { direction: 'right', label: '是' },
    ),
    buildEdge(
      conditionNode.id,
      currentNodeNextNodeId,
      {
        sourceHandle: `${conditionNode.id}__bottom`,
        targetHandle: `${currentNodeNextNodeId}__left`,
        label: '否',
      },
    ),
  ];

  return elements.filter((element) => {
    const edgeToRemove = isEdge(element) && element.source === currentNode.id &&
        element.target === currentNodeNextNodeId;
    return !edgeToRemove;
  }).concat([...edges, conditionNode]);
}

export function addRequestNode(
  currentNodeId: string, position: 'right' | 'bottom', elements: POLY_API.Element[],
): POLY_API.Element[] {
  const currentNode = elements.find((el) => el.id === currentNodeId) as POLY_API.NodeElement | undefined;
  const isCondition = currentNode?.type === 'if';
  if (!currentNode) {
    return elements;
  }

  const requestNode = buildRequestNode();

  if (position === 'right') {
    return isCondition ?
      addRequestNodeOnCondition(currentNode, requestNode, elements, 'right') :
      addRequestNodeOnRight(currentNode, requestNode, elements);
  }

  return isCondition ?
    addRequestNodeOnCondition(currentNode, requestNode, elements, 'bottom') :
    addRequestNodeOnBottom(requestNode, elements);
}

export function addConditionNode(
  currentNodeId: string, position: 'right' | 'bottom', elements: POLY_API.Element[],
): POLY_API.Element[] {
  const currentNode = elements.find(
    (element) => element.id === currentNodeId,
  ) as POLY_API.NodeElement | undefined;
  if (!currentNode) {
    return elements;
  }

  const conditionNode = buildConditionNode();

  return addConditionNodeOnRequest(currentNode, conditionNode, elements, position);
}
