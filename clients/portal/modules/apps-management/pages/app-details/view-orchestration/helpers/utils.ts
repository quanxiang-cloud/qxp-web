import { get } from 'lodash';
import { nanoid } from 'nanoid';
import { findNodeByID, appendChild, getNodeParents } from '@one-for-all/schema-utils';
import { Schema, RouteNode, SchemaNode } from '@one-for-all/schema-spec';

import { setBatchGlobalConfig } from '@lib/api/user-config';

import { VERSION } from '../constants';

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
  return get(layoutNode, 'children.1.id');
}

export function addRouteNodeToLayout(
  rootNode: SchemaNode,
  layoutID: string,
  routeNode: RouteNode,
): SchemaNode | undefined {
  const routesContainerID = isLayoutNode(rootNode) ?
    getLayoutRoutesContainerID(rootNode, layoutID) :
    rootNode.id as string;

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
  if (!isLayoutNode(rootNode)) {
    return appendChild(rootNode, rootNode.id as string, routeNode);
  }

  return addRouteNodeToLayout(rootNode, rootNode.id as string, routeNode);
}
