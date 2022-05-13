import { cloneDeep, set, get } from 'lodash';

import {
  Artery,
  BaseFunctionSpec,
  LoopContainerNode,
  IndividualLoopContainer,
  Node,
  NodeProperty,
  ComposedNode,
  ComposedNodeChild,
  LifecycleHookFuncSpec,
} from '@one-for-all/artery';
import { patchNode } from '@one-for-all/artery-utils';
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

export function isBaseProperty(property: unknown): boolean {
  return isConstantProperty(property) || isLifecycleHooks(property) || isFunctionalProperty(property);
}

export function isStateProperty(property: unknown): boolean {
  return isShareStateProperty(property) || isApiStateProperty(property);
}

export function isLifecycleHooks(hooks: unknown): boolean {
  return (
    !!hooks &&
    typeof hooks === 'object' &&
    (hooks as LifecycleHookFuncSpec).type === 'lifecycle_hook_func_spec'
  );
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

export function findNode(tree: Node | ComposedNode, node_id?: string, loopNode?: boolean): any {
  if (!tree || typeof tree !== 'object') {
    return;
  }
  if (!node_id || tree.id === node_id) {
    return tree;
  }
  if (tree.type === 'composed-node') {
    const { outLayer, children, nodes } = tree || {};
    if (outLayer && outLayer.id === node_id) {
      return loopNode ? tree : outLayer;
    }
    if (nodes || children) {
      for (const child of nodes || children) {
        const found = findNode(child as Node, node_id, loopNode);
        if (found) {
          return loopNode ? tree : found;
        }
      }
    }
  }
  // if loop node, return wrapper node
  if (tree.type === 'loop-container') {
    if (tree.node?.type === 'composed-node') {
      const { outLayer, children, nodes } = tree.node || {};
      if (outLayer && outLayer.id === node_id) {
        return loopNode ? tree : outLayer;
      }
      if (nodes || children) {
        for (const child of nodes || children) {
          const found = findNode(child as Node, node_id, loopNode);
          if (found) {
            return loopNode ? tree : found;
          }
        }
      }
    } else if (get(tree, 'node.id') === node_id) {
      return loopNode ? tree : tree.node;
    } else if ('children' in tree.node && tree.node.children) {
      for (const child of tree.node.children) {
        const found = findNode(child as Node, node_id, loopNode);
        if (found) {
          return found;
        }
      }
    }
  }

  if ('children' in tree && tree.children) {
    for (const child of tree.children) {
      const found = findNode(child as Node, node_id, loopNode);
      if (found) {
        return found;
      }
    }
  }
}

export function replaceTreeNode(tree: Node, node_id: string, newNode: Node): void {
  if (!tree || typeof tree !== 'object') {
    return;
  }
  let newIndex = 0;
  let outAdd = false;
  if ('children' in tree && tree.children) {
    tree.children.map((child, index) => {
      if (child.id === node_id) {
        newIndex = index;
        outAdd = true;
        return;
      }

      if (child.type === 'loop-container') {
        const { node } = child;
        if (node) {
          if (node.id === node_id) {
            outAdd = true;
            newIndex = index;
            return;
          }

          if (node.type === 'composed-node') {
            const { children, outLayer, nodes } = node;
            if (outLayer && outLayer.id === node_id) {
              outAdd = true;
              newIndex = index;
              return;
            }
            let inAdd = false;
            (nodes || children || []).map((item, _index) => {
              if (item.id === node_id) {
                inAdd = true;
                newIndex = _index;
                return;
              }
              return item;
            });

            inAdd && (nodes || children)?.splice(newIndex, 1, newNode as ComposedNodeChild);
            return;
          }
        }
        return;
      }

      if ('children' in child && child.children) {
        replaceTreeNode(child, node_id, newNode);
        return;
      }
    });

    outAdd && tree.children.splice(newIndex, 1, newNode);
  }

  return;
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
