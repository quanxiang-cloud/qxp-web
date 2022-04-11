import { has, is, values, lensPath, set, view } from 'ramda';
import {
  Artery,
  Node,
  LoopContainerNode,
  ComposedNodeLoopContainer,
  HTMLNode,
  ReactComponentNode,
  ComposedNodeChild,
  IndividualLoopContainer,
} from '@one-for-all/artery';

import { generateNodeId } from '.';
import { mapRawProps } from './artery-adapter';

const isObject = is(Object);
const isString = is(String);

function isArteryNode(node: unknown): node is Node {
  return has('id', node);
}

export function traverseArtery(artery: Artery, callback: (node: Node, parent: any) => void): void {
  const traverse = (node: Node, parent: any): void => {
    callback(node, parent);
    values(node).forEach((propertyValue) => {
      if (isObject(propertyValue) && isArteryNode(propertyValue)) {
        traverse(propertyValue, node);
      }
    });
  };
  traverse(artery.node, null);
}

function findNode(nodeId: string, artery: Artery): Node | undefined {
  let arteryNode: undefined | Node;
  traverseArtery(artery, (node: Node) => {
    if (node.id === nodeId) {
      arteryNode = node;
    }
  });
  return arteryNode;
}

function isLoopContainerNode(node: Node): node is LoopContainerNode {
  return node.type === 'loop-container';
}

function isIndividualLoopContainer(node: Node): node is IndividualLoopContainer {
  return isLoopContainerNode(node) && has('toProps', node);
}

function isComposedNodeLoopContainer(node: Node): node is ComposedNodeLoopContainer {
  return isLoopContainerNode(node) && node.node.type === 'composed-node';
}

function isComposedNodeChildNode(node: Node): node is ComposedNodeChild {
  return has('toProps', node);
}

function isNodeHasToProps(node: Node): node is IndividualLoopContainer | ComposedNodeChild {
  return isIndividualLoopContainer(node) || isComposedNodeChildNode(node);
}

function isHTMLNode(node: Node): node is HTMLNode {
  return node.type === 'html-element';
}

function isReactComponentNode(node: Node): node is ReactComponentNode {
  return node.type === 'react-component';
}

function isNodeAcceptChild(node: Node): boolean {
  return isHTMLNode(node) || isReactComponentNode(node);
}

function generateGridChildrenNode(nodeId: string): Node {
  return {
    id: nodeId,
    type: 'react-component',
    exportName: 'container',
    packageName: 'ofa-ui',
    packageVersion: 'latest',
    label: '容器',
    props: {
      style: {
        type: 'constant_property',
        value: {
          display: 'flex',
          flexFlow: 'column nowrap',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          gridArea: 'span 1 / span 1 / auto / auto',
          minWidth: 'auto',
        },
      },
      id: {
        type: 'constant_property',
        value: nodeId,
      },
    },
    children: [],
  };
}

function fixGridScale(scale: string): number {
  const scaleResult = +scale >= 12 ? 12 : +scale;
  return scaleResult === 0 ? 1 : scaleResult;
}

export function generateGridChildren(
  node: ReactComponentNode,
  option?: { colRatio?: string },
): Array<Node> {
  const { props, children = [] } = node;
  const { colRatio = '12' } = option ?? props ?? {};
  const scales: string[] = isString(colRatio) ? colRatio.split(':') : [];

  let newChildren: Node[] = [...children];
  const childrenLength = children?.length || 0;
  if (childrenLength > scales.length) {
    newChildren = newChildren.slice(0, scales.length);
  } else if (childrenLength < scales.length) {
    const nodesNumberToAdd = scales.length - childrenLength + 1;
    Array(nodesNumberToAdd).fill(0).forEach(() => {
      const nodeId = generateNodeId('container');
      newChildren.push(generateGridChildrenNode(nodeId));
    });
  }

  return newChildren.map((child, index) => {
    const scale = fixGridScale(scales[index]);
    const styleValuePath = lensPath(['props', 'style', 'value']);
    const newStyleValue = {
      ...view(styleValuePath, child),
      gridArea: `span 1 / span ${scale} / auto / auto`,
    };
    set(styleValuePath, newStyleValue, child);
    return child;
  });
}

function isGridComponentNode(node: ReactComponentNode): boolean {
  return node.exportName === 'grid';
}

function isModalComponentNode(node: ReactComponentNode): boolean {
  return node.exportName === 'modal';
}

enum NodePosition {
  INNER = 'inner',
  UP = 'up',
  DOWN = 'down',
}
interface InsertNodeParams {
  newNode: Node;
  targetNodeId: string;
  artery: Artery;
  position: NodePosition;
}
export function insertNode({ newNode, targetNodeId, artery, position }: InsertNodeParams): void {
  const targetNode = findNode(targetNodeId, artery);
  const foundNode = findNode(newNode.id, artery);
  if (!targetNode || foundNode) {
    return;
  }

  if (isNodeAcceptChild(newNode)) {
    Object.assign(newNode, { children: [] });
    if (isReactComponentNode(newNode)) {
      if (isGridComponentNode(newNode)) {
        newNode.children = generateGridChildren(newNode);
      } else if (isModalComponentNode(newNode)) {
        newNode.children = [{
          id: generateNodeId('container'),
          type: 'react-component',
          exportName: 'container',
          packageName: 'ofa-ui',
          packageVersion: 'latest',
          label: '容器',
          props: {},
          children: [],
        }];
      }
    }
  }

  if (isComposedNodeLoopContainer(targetNode) && isNodeHasToProps(newNode)) {
    const rawPropsKeys = Object.keys(mapRawProps(newNode.props!)).join(',');
    newNode.toProps = {
      type: 'to_props_function_spec',
      args: 'state',
      body: `//${rawPropsKeys}\nreturn {}`,
    };
  }

  window.__isDev__ && console.log('append node: ', newNode, targetNode, position);
  if (position === 'up') {
    // insertBefore(newNode, targetNode);
  } else if (position === 'inner') {
    // appendChild(newNode, targetNode, targetNode);
  } else if (position === 'down') {
    // insertAfter(newNode, targetNode);
  }
}
