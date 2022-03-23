import { get } from 'lodash';
import { nanoid } from 'nanoid';
import { findNodeByID, appendChild, getNodeParents } from '@one-for-all/schema-utils';
import { Schema, RouteNode, SchemaNode, HTMLNode } from '@one-for-all/schema-spec';

import { getBatchGlobalConfig, setBatchGlobalConfig } from '@lib/api/user-config';

import { LAYOUT_CHILD_TYPE_ROUTES_CONTAINER, ROOT_NODE_ID, VERSION } from '../constants';

export function genNodeID(): string {
  return nanoid(8);
}

export function isLayoutNode(node: SchemaNode): boolean {
  return get(node, 'props.data-internal-node.value') === true &&
    get(node, 'props.data-layout.value') === true;
}

export function genDesktopRootViewSchemaKey(appID: string): string {
  return `app_id:${appID}:desktop_view_schema:root`;
}

export function genDesktopViewSchemaKey(appID: string): string {
  return `app_id:${appID}:desktop_view_schema:${genNodeID()}`;
}

export function saveSchema(schemaKey: string, schema: Schema): FutureErrorMessage {
  const params = {
    key: schemaKey,
    value: JSON.stringify(schema),
    version: VERSION,
  };
  return setBatchGlobalConfig([params]).catch(() => {
    return 'failed to save schema';
  });
}

export async function fetchSchema(appID: string): Promise<SchemaNode> {
  const key = genDesktopRootViewSchemaKey(appID);
  const { result } = await getBatchGlobalConfig([{ key: key, version: '1.0.0' }]);
  return JSON.parse(result[key]);
}

export async function createRefSchema(appID: string): Promise<string> {
  const refSchemaKey = genDesktopViewSchemaKey(appID);
  const refedSchema: Schema = {
    node: { id: genNodeID(), type: 'html-element', name: 'div' },
  };

  await saveSchema(refSchemaKey, refedSchema);

  return Promise.resolve(refSchemaKey);
}

export function attachToRouteNode(node: SchemaNode, routeFor: 'layout' | 'view'): RouteNode {
  // todo generate route path by chinese
  const routePath = routeFor === 'layout' ? `l-${genNodeID()}` : 'p-${genNodeID()}';

  return {
    id: genNodeID(),
    type: 'route-node',
    path: routePath,
    node: node,
  };
}

function getLayoutRoutesContainerID(rootNode: SchemaNode, layoutID: string): string | undefined {
  const layoutNode = findNodeByID(rootNode, layoutID);
  if (!layoutNode) {
    return;
  }

  const childNode = ((layoutNode as HTMLNode).children || []).find((childNode) => {
    return get(childNode, 'props.data-layout-child.value') === LAYOUT_CHILD_TYPE_ROUTES_CONTAINER;
  });

  if (!childNode) {
    return;
  }

  return childNode.id;
}

export function addRouteNodeToLayout(
  rootNode: SchemaNode,
  layoutID: string,
  routeNode: RouteNode,
): SchemaNode | undefined {
  const routesContainerID = getLayoutRoutesContainerID(rootNode, layoutID);
  if (!routesContainerID) {
    return;
  }

  return appendChild(rootNode, routesContainerID, routeNode);
}

export function findFirstRouteParentID(rootNode: SchemaNode, id: string): string | undefined {
  const parents = getNodeParents(rootNode, id);
  if (!parents) {
    return;
  }

  return parents.reverse().find(({ type }) => type === 'route-node')?.id as string;
}

export function addRouteNodeToRootNode(rootNode: SchemaNode, routeNode: RouteNode): SchemaNode | undefined {
  const _rootNode = findNodeByID(rootNode, ROOT_NODE_ID);
  if (!_rootNode) {
    return;
  }

  if (!isLayoutNode(_rootNode)) {
    return appendChild(rootNode, rootNode.id, routeNode);
  }

  return addRouteNodeToLayout(rootNode, _rootNode.id, routeNode);
}
