import { get } from 'lodash';
import { nanoid } from 'nanoid';

import { findNodeByID, appendChild, getNodeParents } from '@one-for-all/artery-utils';
import { Artery, RouteNode, Node, HTMLNode, RefNode } from '@one-for-all/artery';

import { ARTERY_KEY_VERSION } from '@portal/constants';
import { getBatchGlobalConfig, setBatchGlobalConfig } from '@lib/api/user-config';

import { LAYOUT_CHILD_TYPE_ROUTES_CONTAINER, ROOT_NODE_ID } from '../constants';

export function genNodeID(): string {
  return nanoid(8);
}

export function isLayoutNode(node: Node): boolean {
  return get(node, 'props.data-internal-node.value') === true &&
    get(node, 'props.data-layout.value') === true;
}

export function genDesktopRootArteryKey(appID: string): string {
  return `app_id:${appID}:desktop_artery:root`;
}

export function genDesktopArteryKey(appID: string): string {
  return `app_id:${appID}:desktop_artery:${genNodeID()}`;
}

export function saveArtery(arteryID: string, schema: Artery): FutureErrorMessage {
  const params = {
    key: arteryID,
    value: JSON.stringify(schema),
    version: ARTERY_KEY_VERSION,
  };
  return setBatchGlobalConfig([params]).catch(() => {
    return 'failed to save schema';
  });
}

export async function fetchSchema(appID: string): Promise<Artery> {
  const key = genDesktopRootArteryKey(appID);
  const { result } = await getBatchGlobalConfig([{ key: key, version: '1.0.0' }]);
  return JSON.parse(result[key]);
}

export async function createRefSchema(appID: string): Promise<string> {
  const refSchemaKey = genDesktopArteryKey(appID);
  const refedSchema: Artery = {
    node: { id: genNodeID(), type: 'html-element', name: 'div' },
  };

  await saveArtery(refSchemaKey, refedSchema);

  return Promise.resolve(refSchemaKey);
}

export async function copyRefSchema(appID: string, arteryRefKey: string): Promise<string> {
  const refSchemaKey = genDesktopArteryKey(appID);
  await getBatchGlobalConfig([{ key: arteryRefKey, version: '1.0.0' }]).then(({ result }) => {
    saveArtery(refSchemaKey, JSON.parse(result[arteryRefKey]));
  });

  return Promise.resolve(refSchemaKey);
}

export function attachToRouteNode(node: Node, routeFor: 'layout' | 'view'): RouteNode {
  // todo generate route path by chinese
  const routePath = routeFor === 'layout' ? `l-${genNodeID()}` : `p-${genNodeID()}`;

  return {
    id: genNodeID(),
    type: 'route-node',
    path: routePath,
    node: node,
  };
}

function getLayoutRoutesContainerID(rootNode: Node, layoutID: string): string | undefined {
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
  rootNode: Node,
  layoutID: string,
  routeNode: RouteNode,
): Node | undefined {
  const routesContainerID = getLayoutRoutesContainerID(rootNode, layoutID);
  if (!routesContainerID) {
    return;
  }

  return appendChild(rootNode, routesContainerID, routeNode);
}

export function findFirstRouteParentID(rootNode: Node, id: string): string | undefined {
  const parents = getNodeParents(rootNode, id);
  if (!parents) {
    return;
  }

  return parents.reverse().find(({ type }) => type === 'route-node')?.id as string;
}

export function addRouteNodeToRootNode(rootNode: Node, routeNode: RouteNode): Node | undefined {
  const _rootNode = findNodeByID(rootNode, ROOT_NODE_ID);
  if (!_rootNode) {
    return;
  }

  if (!isLayoutNode(_rootNode)) {
    return appendChild(rootNode, _rootNode.id, routeNode);
  }

  return addRouteNodeToLayout(rootNode, _rootNode.id, routeNode);
}

export function createAppLandingPage(): Artery {
  const nodeID = genNodeID();
  const textNodeID = 'text-' + genNodeID();

  const ARTERY_DEMO: Artery = {
    node: {
      id: nodeID,
      type: 'react-component',
      packageName: 'ofa-ui',
      packageVersion: 'latest',
      exportName: 'page',
      label: '示例页面',
      props: {
        style: {
          type: 'constant_property',
          value: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 400,
            flexWrap: 'nowrap',
          },
        },
      },
      children: [{
        exportName: 'text',
        label: '文本',
        id: textNodeID,
        supportStateExposure: true,
        type: 'react-component',
        packageName: 'ofa-ui',
        packageVersion: 'latest',
        props: {
          id: {
            type: 'constant_property',
            value: textNodeID,
          },
          content: {
            type: 'constant_property',
            value: '页面设计示例页面',
          },
          isAllowSelect: {
            type: 'constant_property',
            value: false,
          },
          style: {
            type: 'constant_property',
            value: {
              display: 'block',
              fontSize: '50px',
              fontWeight: 600,
              color: '#000000',
              borderStyle: 'none',
              borderWidth: 1,
            },
          },
        },
      }],
    },
    apiStateSpec: {},
    sharedStatesSpec: {},
  };

  return ARTERY_DEMO;
}

export async function createAppLandingRouteNode(): Promise<RouteNode> {
  const demoViewRefArteryKey = genDesktopArteryKey(genNodeID());
  const refNode: RefNode = {
    id: genNodeID(),
    type: 'ref-node',
    arteryID: demoViewRefArteryKey,
    label: '示例页面',
  };

  const demoViewNode = attachToRouteNode(refNode, 'view');
  return saveArtery(demoViewRefArteryKey, createAppLandingPage()).then(() => {
    return demoViewNode;
  });
}
