import React, { MutableRefObject, Ref } from 'react';
import { Edge, isEdge, removeElements } from 'react-flow-renderer';
import { ifElse, flatten } from 'ramda';
import { fromEvent, of, Subscription } from 'rxjs';
import { map, mergeAll } from 'rxjs/operators';

import { nanoid } from '@c/form-builder/utils';

import { POLY_DESIGN_CONFIG } from '../constants';
import { PolyNodeStore } from '../store/node';
import layout from './layout';
import store$ from '../store';

interface BuildEdgeOption {
  direction?: 'right' | 'bottom';
  label?: string;
  sourceHandle?: string;
  targetHandle?: string;
  idAppend?: number;
}
interface BuildEdgeProps {
  source: string;
  target: string;
  options?: BuildEdgeOption;
}
export function buildEdge(
  source: string,
  target: string,
  {
    direction, label, sourceHandle, targetHandle, idAppend,
  }: BuildEdgeOption = { direction: 'right' },
): POLY_API.EdgeElement {
  const sourceHandleI = sourceHandle || (direction === 'right' ? `${source}__right` : `${source}__bottom`);
  const targetHandleI = targetHandle || (direction === 'right' ? `${target}__left` : `${target}__top`);
  function getEdge(): Edge {
    return {
      id: `e${source}-${target}${idAppend ? `-${idAppend }` : ''}`, source, target,
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
  const id = nanoid();
  return {
    id,
    type: 'input',
    data: new PolyNodeStore({
      title: '',
      name: id,
      type: 'input',
      nextNodes: [],
      detail: { inputs: [], consts: [] },
      handles: { right: `${id}__right` },
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
  const id = nanoid();
  return {
    id,
    type: 'end',
    data: new PolyNodeStore({
      title: '',
      name: id,
      type: 'end',
      nextNodes: [],
      detail: {
        body: {
          type: 'object',
          data: [],
        },
      },
      handles: { left: `${id}__left` },
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
  const edges = [buildEdge(parent.id, next.id)];
  parent.data?.set('nextNodes', [next.id]);
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
  isYes && edgesToAdd.push(buildEdge(parent.id, next.id));
  isNo && edgesToAdd.push(
    buildEdge(parent.id, next.id, { sourceHandle: `${parent.id}__bottom`, targetHandle: `${next.id}__left` }),
  );
  isYes && parent.data?.set('detail.yes', next.id);
  isNo && parent.data?.set('detail.no', next.id);

  const parentPreviousNextNodes = parent.data?.get<string[]>('nextNodes') || [];
  parent.data?.set(
    'nextNodes', parentPreviousNextNodes.filter((id) => id !== current.id).concat([next.id]),
  );
  const newElements = removeElements([current], elements);
  return newElements.concat(edgesToAdd);
  // return elements.filter((element) => {
  //   const shouldRemove = (element.id === current.id) ||
  //     (isEdge(element) && (element.target === current.id || element.source === current.id));
  //   return !shouldRemove;
  // }).concat(edgesToAdd);
}

function getCurrentNodeParentNode(
  current: POLY_API.NodeElement, elements: POLY_API.Element[],
): POLY_API.NodeElement | undefined {
  return elements.find((element) => {
    const nextNodes = element.data?.get<string[]>('nextNodes') || [];
    return nextNodes.includes(current.id);
  }) as POLY_API.NodeElement | undefined;
}

function removeCurrentRequestNode(
  nodeToRemove: POLY_API.NodeElement, elements: POLY_API.Element[],
): POLY_API.Element[] {
  // 1. 当前节点是请求节点, 节点在请求节点之间, 或者节点在请求与判断节点之间
  // 2. 当前节点是请求节点, 节点在判断与请求节点之间
  const currentNodeParentNode = getCurrentNodeParentNode(nodeToRemove, elements);
  const currentNodeNextNodeId = nodeToRemove.data?.get<string>('nextNodes')?.[0];
  const currentNodeNextNode = elements.find(
    (element) => element.id === currentNodeNextNodeId,
  ) as POLY_API.NodeElement | undefined;
  if (!currentNodeNextNode?.type || !currentNodeParentNode?.type) {
    return elements;
  }
  const belongsToRequest = ['request', 'input', 'end'];
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
  const nextNodes = current.data?.get<string[]>('nextNodes') || [];
  if (!nextNodes.length) {
    return [];
  }
  const elementsMap = elementsToMap(elements);
  const allNodes = nextNodes.map((id) => {
    const element = elementsMap[id] as POLY_API.NodeElement;
    if (!filter?.(element)) {
      return [];
    }
    return [element].concat(getDescendantNodes(element, elements));
  });
  return flatten(allNodes);
}

function removeCurrentConditionNode(
  nodeToRemove: POLY_API.NodeElement, elements: POLY_API.Element[],
): POLY_API.Element[] {
  // 1. 当前节点是判断节点, 节点在请求节点之间
  const currentNodeParentNode = getCurrentNodeParentNode(nodeToRemove, elements);
  const descendantNodes = getDescendantNodes(nodeToRemove, elements, (element) => element.type !== 'end');
  const endNode = elements.find((element) => element.type === 'end') as POLY_API.NodeElement | undefined;
  if (!currentNodeParentNode || !endNode) {
    return elements;
  }
  const edges = [buildEdge(currentNodeParentNode.id, endNode.id)];
  const newElements = removeElements(descendantNodes, elements);
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
  requestNode: POLY_API.Element, nodes: POLY_API.Element[],
): POLY_API.Element[] {
  let inputNode;
  let endNode;
  for (let index = 0; index < nodes.length; index += 1) {
    const element = nodes[index];
    if (element.type === 'input') {
      inputNode = element;
    } else if (element.type === 'end') {
      endNode = element;
    }
    if (inputNode && endNode) {
      break;
    }
  }
  if (!inputNode || !endNode) {
    return nodes;
  }
  const inputNodeNextIds = inputNode.data?.get<string[]>('nextNodes') || [];
  inputNode.data?.set('nextNodes', [...inputNodeNextIds, requestNode.id]);
  requestNode.data?.set('nextNodes', [endNode.id]);

  return nodes.concat([
    buildEdge(inputNode.id, requestNode.id), buildEdge(requestNode.id, endNode.id), requestNode,
  ]);
}

export function addConditionNodeOnBottom(
  currentNode: POLY_API.Element, conditionNode: POLY_API.Element, nodes: POLY_API.Element[],
): POLY_API.Element[] {
  const endNode = nodes.find((node) => node.type === 'end');
  if (!endNode) {
    return nodes;
  }
  const currentNodeNextNodeIds = currentNode.data?.get<string[]>('nextNodes') || [];
  currentNode.data?.set('nextNodes', [...currentNodeNextNodeIds, conditionNode.id]);
  conditionNode.data?.set('nextNodes', [endNode.id]);
  return nodes.concat([
    buildEdge(
      currentNode.id,
      conditionNode.id,
      { sourceHandle: `${currentNode.id}__bottom`, targetHandle: `${conditionNode.id}__left` },
    ),
    buildEdge(conditionNode.id, endNode.id, { direction: 'right', idAppend: 1 }),
    buildEdge(
      conditionNode.id,
      endNode.id,
      { sourceHandle: `${conditionNode.id}__bottom`, targetHandle: `${endNode.id}__left`, idAppend: 2 },
    ),
    conditionNode,
  ]);
}

function addRequestNodeOnRight(
  currentNode: POLY_API.Element, requestNode: POLY_API.Element, nodes: POLY_API.Element[],
): POLY_API.Element[] {
  const currentNodeNextNodeIds = currentNode.data?.get<string[]>('nextNodes') || [];
  const edges = currentNodeNextNodeIds.map((nodeId) => {
    return buildEdge(requestNode.id, nodeId, { direction: 'right' });
  }).concat(buildEdge(currentNode.id, requestNode.id, { direction: 'right' }));
  currentNode.data?.set('nextNodes', [requestNode.id]);
  requestNode.data?.set('nextNodes', currentNodeNextNodeIds);

  return nodes
    .filter((node) => {
      const edgeToRemove = isEdge(node) &&
        node.source === currentNode.id &&
        currentNodeNextNodeIds.includes(node.target);
      return !edgeToRemove;
    }).concat([...edges, requestNode]);
}

function addRequestNodeOnCondition(
  currentNode: POLY_API.Element,
  requestNode: POLY_API.Element,
  nodes: POLY_API.Element[],
  direction: 'right' | 'bottom',
): POLY_API.Element[] {
  const edgeToRemove = nodes.filter(
    (node) => isEdge(node) && node.sourceHandle === `${currentNode.id}__${direction}`,
  );
  const edgeToRemoveIds = edgeToRemove.map((edge) => edge.id);
  const currentNodeNextRightNodeIds = edgeToRemove.map((edge) => (edge as POLY_API.EdgeElement).target);
  const previousNextNodes = currentNode.data?.get<string[]>('nextNodes') || [];
  const currentNewNextNodes = previousNextNodes.filter((id) => !currentNodeNextRightNodeIds.includes(id));
  currentNode.data?.set('nextNodes', [requestNode.id, ...currentNewNextNodes]);
  requestNode.data?.set('nextNodes', currentNodeNextRightNodeIds);
  const edges = currentNodeNextRightNodeIds.map((nodeId) => {
    return buildEdge(requestNode.id, nodeId, { direction: 'right' });
  }).concat([
    direction === 'right' ?
      buildEdge(currentNode.id, requestNode.id, { direction: 'right', label: '是' }) :
      buildEdge(currentNode.id, requestNode.id, {
        sourceHandle: `${currentNode.id}__bottom`, targetHandle: `${requestNode.id}__left`, label: '否',
      }),
  ]);
  direction === 'right' && currentNode.data?.set('detail.yes', requestNode.id);
  direction === 'bottom' && currentNode.data?.set('detail.no', requestNode.id);
  return nodes.filter((node) => {
    return !edgeToRemoveIds.includes(node.id);
  }).concat([
    ...edges,
    requestNode,
  ]);
}

function addConditionNodeOnRight(
  currentNode: POLY_API.Element, conditionNode: POLY_API.Element, nodes: POLY_API.Element[],
): POLY_API.Element[] {
  const currentNodeNextNodeIds = currentNode.data?.get<string[]>('nextNodes') || [];
  const twoDimensionalEdges = currentNodeNextNodeIds.map((nodeId) => {
    conditionNode.data?.set('detail.yes', nodeId);
    conditionNode.data?.set('detail.no', nodeId);
    return [
      buildEdge(
        conditionNode.id,
        nodeId,
        { direction: 'right', idAppend: 1, label: '是' },
      ),
      buildEdge(
        conditionNode.id,
        nodeId,
        {
          sourceHandle: `${conditionNode.id}__bottom`,
          targetHandle: `${nodeId}__left`,
          idAppend: 2,
          label: '否',
        },
      ),
    ];
  });
  const edges = flatten(twoDimensionalEdges).concat(
    buildEdge(currentNode.id, conditionNode.id, { direction: 'right' }),
  );
  currentNode.data?.set('nextNodes', [conditionNode.id]);
  conditionNode.data?.set('nextNodes', currentNodeNextNodeIds);

  return nodes
    .filter((node) => {
      const edgeToRemove = isEdge(node) &&
        node.source === currentNode.id &&
        currentNodeNextNodeIds.includes(node.target);
      return !edgeToRemove;
    }).concat([...edges, conditionNode]);
}

export function addRequestNode(
  currentNodeId: string, position: 'right' | 'bottom', nodes: POLY_API.Element[],
): POLY_API.Element[] {
  const currentNode = nodes.find((node) => node.id === currentNodeId);
  const isCondition = currentNode?.type === 'if';
  if (!currentNode) {
    return nodes;
  }

  const requestNode = buildRequestNode();

  if (position === 'right') {
    return isCondition ?
      addRequestNodeOnCondition(currentNode, requestNode, nodes, 'right') :
      addRequestNodeOnRight(currentNode, requestNode, nodes);
  }

  return isCondition ?
    addRequestNodeOnCondition(currentNode, requestNode, nodes, 'bottom') :
    addRequestNodeOnBottom(requestNode, nodes);
}

export function addConditionNode(
  currentNodeId: string, position: 'right' | 'bottom', nodes: POLY_API.Element[],
): POLY_API.Element[] {
  const currentNode = nodes.find((node) => node.id === currentNodeId);
  if (!currentNode) {
    return nodes;
  }

  const conditionNode = buildConditionNode();

  if (position === 'right') {
    return addConditionNodeOnRight(currentNode, conditionNode, nodes);
  }

  return addConditionNodeOnBottom(currentNode, conditionNode, nodes);
}
