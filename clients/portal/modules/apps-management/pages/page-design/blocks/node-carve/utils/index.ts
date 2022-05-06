import { cloneDeep, set } from 'lodash';
import {
  Artery,
  BaseFunctionSpec,
  LoopContainerNode,
  IndividualLoopContainer,
  Node,
  NodeProperty,
  ComposedNode,
  LifecycleHookFuncSpec,
} from '@one-for-all/artery';
import { patchNode } from '@one-for-all/artery-utils';
import { findNode, replaceNode as replaceTreeNode } from './tree';
import { generateNodeId } from '@one-for-all/artery-engine';

export function isConstantProperty(
  property: unknown,
): boolean {
  return (
    !!property &&
    typeof property === 'object' &&
    (property as NodeProperty).type === 'constant_property'
  );
}

export function isFunctionalProperty(property: unknown): boolean {
  return (
    !!property &&
    typeof property === 'object' &&
    (property as NodeProperty).type === 'functional_property'
  );
}

export function isShareStateProperty(property: unknown): boolean {
  return (
    !!property &&
    typeof property === 'object' &&
    (property as NodeProperty).type === 'shared_state_property'
  );
}

export function isApiStateProperty(property: unknown): boolean {
  return (
    !!property &&
    typeof property === 'object' &&
    (property as NodeProperty).type === 'api_result_property'
  );
}

export function isLifecycleHooks(hooks: unknown): boolean {
  return (
    !!hooks &&
    typeof hooks === 'object' &&
    (hooks as LifecycleHookFuncSpec).type === 'lifecycle_hook_func_spec'
  );
}

export function isBaseProperty(property: unknown): boolean {
  return isConstantProperty(property) || isLifecycleHooks(property) || isFunctionalProperty(property);
}

export function isStateProperty(property: unknown): boolean {
  return isShareStateProperty(property) || isApiStateProperty(property);
}

export function getActualNode(node: Node, currentNode: Node): Node {
  let actualNode = node;
  if (node.type === 'loop-container') {
    if (node.node.type === 'composed-node') {
      const { outLayer, children, nodes } = node.node;
      if (outLayer && outLayer.id === currentNode.id) {
        actualNode = outLayer;
      }

      if ((nodes || children) && outLayer?.id !== currentNode.id) {
        actualNode = (nodes || children).find(
          (item: Node) => item.id === currentNode.id,
        ) as Node;
      }
    } else {
      actualNode = node.node;
    }
  }
  return actualNode;
}

export function updateNodeProperty(
  node: Node,
  path: string,
  value: NodeProperty | BaseFunctionSpec | '',
  artery: Artery,
): Artery {
  const rawNode = findNode(artery.node, node.id, true);
  const actualNode = getActualNode(rawNode, node);
  set(actualNode, path, value);
  patchNode(artery.node, rawNode);
  return { ...artery };
}

export function setNodeAsComposedNode(
  target: Node,
  composedConfig: Partial<LoopContainerNode>,
  artery: Artery,
): Artery {
  const composedNodeConfig: LoopContainerNode = {
    id: generateNodeId('loop-node'),
    props: {},
    type: 'loop-container',
    loopKey: composedConfig.loopKey || 'id',
    iterableState: composedConfig.iterableState || {},
    node: composedConfig.node || {},
  } as LoopContainerNode;

  return replaceNode(target, composedNodeConfig, artery);
}

export function replaceNode(
  node: Node,
  replaced: Node,
  artery: Artery,
): Artery {
  const srcNode = findNode(artery.node, node.id, true);
  if (srcNode.type === 'loop-container') {
    if (srcNode.node && srcNode.node.type === 'composed-node') {
      const { children, outLayer, nodes } = srcNode.node;
      if (outLayer.id !== node.id) {
        let _oldNode = {} as Node;
        (nodes || children || []).forEach((child: Node) => {
          if (child.id === node.id) {
            _oldNode = child;
          }
          return child;
        });
        if (_oldNode.id) {
          replaceTreeNode(artery.node, node.id, replaced);
        }
      }
    }
  }

  replaceTreeNode(artery.node, node.id, replaced);

  return { ...artery };
}

export function setNodeAsLoopContainer(
  target: Node,
  loopConfig: Partial<IndividualLoopContainer>,
  artery: Artery,
): Artery {
  if (!target) {
    return artery;
  }

  const nodeCopy = cloneDeep(target);
  const loopNodeConfig = {
    id: generateNodeId('loop-node'),
    type: 'loop-container',
    node: nodeCopy,
    loopKey: loopConfig.loopKey || 'id',
    toProps: {
      args: 'state',
      body: loopConfig.toProps || 'return state',
      type: 'to_props_function_spec',
    },
    iterableState: loopConfig.iterableState || {},
  };

  return replaceNode(target, loopNodeConfig as any, artery);
}

export function updateCurNodeAsLoopContainer(
  node: Node,
  propKey: string,
  confItem: any,
  artery: Artery,
): Artery {
  let newArtery;
  const rawNode = findNode(artery.node, node.id, true);
  if (!rawNode?.iterableState) {
    // replace current normal node to loop node
    newArtery = setNodeAsLoopContainer(node, { [propKey]: confItem }, artery);
  } else {
    newArtery = updateNodeProperty(
      rawNode,
      propKey,
      propKey === 'toProps' ?
        {
          args: 'state',
          body: confItem || 'return state',
          type: 'to_props_function_spec',
        } :
        confItem,
      artery,
    );
  }
  return newArtery;
}

export function unsetLoopNode(node: Node, artery: Artery): Artery {
  const loopNode = findNode(artery.node, node.id, true);
  if (!loopNode) {
    return artery;
  }
  if (loopNode.type === 'loop-container') {
    const innerNode = loopNode.node;
    replaceNode(node, innerNode, artery);
  }
  return { ...artery };
}

export function unsetComposedNode(node: Node, artery: Artery): Artery {
  const composedNode = findNode(artery.node, node.id, true);
  if (!composedNode) {
    return artery;
  }
  if (composedNode.type === 'loop-container') {
    const { node } = composedNode;
    if (node) {
      const { outLayer, children, nodes } = node as ComposedNode;
      if (outLayer) {
        const newNode: Node = { ...outLayer };
        newNode.children = children || nodes;
        replaceNode(node, newNode, artery);
      }
    }
  }
  return { ...artery };
}

export function mapSharedStateSpec(artery: Artery) {
  return Object.entries(artery.sharedStatesSpec || {}).reduce(
    (acc: Record<string, any>, [k, v]: [string, any]) => {
      const conf = {
        name: k,
        val: JSON.stringify(v.initial),
        desc: '',
      };
      acc[k] = JSON.stringify(conf);
      return acc;
    },
    {},
  );
}

export function mapApiStateSpec(artery: Artery) {
  return Object.entries(artery.apiStateSpec || {}).reduce(
    (acc: Record<string, any>, [k, v]: [string, any]) => {
      acc[k] = v.apiID;
      return acc;
    },
    {},
  );
}
