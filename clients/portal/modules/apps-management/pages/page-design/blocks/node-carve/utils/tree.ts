import { ComposedNode, ComposedNodeChild, Node } from '@one-for-all/artery';
import { get } from 'lodash';

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

export function replaceNode(tree: Node, node_id: string, newNode: Node): void {
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
            const { children, outLayer } = node;
            if (outLayer && outLayer.id === node_id) {
              outAdd = true;
              newIndex = index;
              return;
            }
            let inAdd = false;
            (children || []).map((item, _index) => {
              if (item.id === node_id) {
                inAdd = true;
                newIndex = _index;
                return;
              }
              return item;
            });

            inAdd && children?.splice(newIndex, 1, newNode as ComposedNodeChild);
            return;
          }
        }
        return;
      }

      if ('children' in child && child.children) {
        replaceNode(child, node_id, newNode);
        return;
      }
    });

    outAdd && tree.children.splice(newIndex, 1, newNode);
  }

  return;
}
