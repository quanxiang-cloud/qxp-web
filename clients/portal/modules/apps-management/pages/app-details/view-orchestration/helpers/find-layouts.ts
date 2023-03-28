import { get } from 'lodash';
import {
  travel,
} from '@one-for-all/artery-utils';
import {
  HTMLNode,
  RouteNode,
  Node,
} from '@one-for-all/artery';

import { Layout } from '../types';
import { isLayoutNode } from './utils';

function getLayoutSubViews(layoutNode: Node): Array<{ id: string; name: string; }> {
  const routeNodes: Array<RouteNode> = get(layoutNode, 'children.1.children') || [];

  return routeNodes.filter((routeNode) => {
    return !isLayoutNode(routeNode.node);
  }).map(({ node }) => ({ id: node.id as string, name: node.label || '' }));
}

// todo optimize this
function getRefSchemaID(layoutNode: Node): string {
  return get(layoutNode, 'children.0.children.0.arteryID') || '';
}

function convertNodeToLayout(node: Node): Layout {
  return {
    id: node.id as string,
    name: node.label || '未命名布局',
    // @ts-ignore
    type: get(node, 'props.data-layout-type.value'),
    // @ts-ignore
    description: get(node, 'props.data-layout-description.value'),
    subViews: getLayoutSubViews(node),
    refSchemaID: getRefSchemaID(node),
  };
}

export default function findLayouts(node: Node): Array<Layout> {
  const layouts: Array<Layout> = [];

  travel(node, {
    htmlNode: (currentNode: HTMLNode): undefined => {
      if (!isLayoutNode(currentNode)) {
        return;
      }

      const layout = convertNodeToLayout(currentNode);
      layouts.push(layout);
    },
  });

  // sort layouts by name
  return layouts.sort((a, b): number => {
    return a.name < b.name ? -1 : 1;
  });
}
