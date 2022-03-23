import { get } from 'lodash';
import {
  travel,
} from '@one-for-all/schema-utils';
import {
  HTMLNode,
  RouteNode,
  SchemaNode,
} from '@one-for-all/schema-spec';

import { Layout } from '../types';
import { isLayoutNode } from './utils';

function getLayoutSubViews(layoutNode: SchemaNode): Array<{ id: string; name: string; }> {
  const routeNodes: Array<RouteNode> = get(layoutNode, 'children.1.children') || [];

  return routeNodes.filter((routeNode) => {
    return !isLayoutNode(routeNode.node);
  }).map(({ node }) => ({ id: node.id as string, name: node.label || '' }));
}

// todo optimize this
function getRefSchemaID(layoutNode: SchemaNode): string {
  return get(layoutNode, 'children.0.children.0.schemaID') || '';
}

function convertNodeToLayout(node: SchemaNode): Layout {
  return {
    id: node.id as string,
    name: node.label || '未命名布局',
    type: get(node, 'props.data-layout-type.value'),
    description: get(node, 'props.data-layout-description.value'),
    subViews: getLayoutSubViews(node),
    refSchemaID: getRefSchemaID(node),
  };
}

export default function findLayouts(node: SchemaNode): Array<Layout> {
  const layouts: Array<Layout> = [];

  travel(node, {
    htmlNode: (currentNode: HTMLNode) => {
      console.log(currentNode);
      if (!isLayoutNode(currentNode)) {
        return;
      }

      layouts.push(convertNodeToLayout(currentNode));
    },
  });
  console.log(layouts);

  // sort layouts by name
  return layouts.sort((a, b): number => {
    return a.name < b.name ? -1 : 1;
  });
}
