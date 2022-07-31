import { get } from 'lodash';
import {
  findNodeByID,
  getNodeParentIDs,
  travel,
} from '@one-for-all/artery-utils';
import {
  ReactComponentNode,
  RefNode,
  RouteNode,
  Node,
} from '@one-for-all/artery';

import { ExternalView, View, ViewType, SchemaView, StaticView, TableSchemaView } from '../types.d';
import { isLayoutNode } from './utils';

const VIEW_RENDER_MAP: Record<string, ViewType> = {
  TableSchemaViewRender: ViewType.TableSchemaView,
  StaticViewRender: ViewType.StaticView,
  ExternalViewRender: ViewType.ExternalView,
};

function getViewType(node: Node): ViewType | undefined {
  if (node.type === 'ref-node') {
    return ViewType.SchemaView;
  }

  if (node.type === 'react-component') {
    return VIEW_RENDER_MAP[node.exportName];
  }
}

export function convertRefNodeToView(node: RefNode): SchemaView {
  return {
    id: node.id as string,
    name: node.label || '',
    type: ViewType.SchemaView,
    arteryID: node.arteryID,
    url: '',
  };
}

export function convertNodeToTableView(node: ReactComponentNode): TableSchemaView {
  return {
    id: node.id as string,
    name: node.label || '',
    type: ViewType.TableSchemaView,
    tableID: get(node, 'props.tableID.value') || '',
    appID: get(node, 'props.appID.value') || '',
    url: '',
  };
}

export function convertNodeToStaticView(node: ReactComponentNode): StaticView {
  return {
    id: node.id as string,
    name: node.label || '',
    type: ViewType.StaticView,
    fileUrl: get(node, 'props.fileUrl.value') || '',
    url: '',
  };
}

export function convertNodeToExternalView(node: ReactComponentNode): ExternalView {
  return {
    id: node.id as string,
    name: node.label || '',
    type: ViewType.ExternalView,
    link: get(node, 'props.link.value') || '',
    appID: get(node, 'props.appID.value') || '',
    url: '',
  };
}

function convertNodeToView(node: Node): View | undefined {
  switch (getViewType(node)) {
  case ViewType.SchemaView:
    return convertRefNodeToView(node as RefNode);
  case ViewType.TableSchemaView:
    return convertNodeToTableView(node as ReactComponentNode);
  case ViewType.ExternalView:
    return convertNodeToExternalView(node as ReactComponentNode);
  case ViewType.StaticView:
    return convertNodeToStaticView(node as ReactComponentNode);
  default:
    break;
  }
}

function fullFillViewURL(view: View, rootNode: Node): View {
  const parentIDs = getNodeParentIDs(rootNode, view.id);
  if (!parentIDs) {
    return view;
  }

  // todo path need prefix
  const url = parentIDs
    .map((id) => findNodeByID(rootNode, id))
    .filter<Node>((node): node is Node => !!node)
    .filter((node): node is RouteNode => node.type === 'route-node')
    .map(({ path }) => path).join('/');

  return { ...view, url };
}

export default function findViews(node: Node): Array<View> {
  const views: Array<View> = [];

  travel(node, {
    routeNode: (routeNode: RouteNode): undefined => {
      if (isLayoutNode(routeNode.node)) {
        return;
      }

      const view = convertNodeToView(routeNode.node);
      if (view) {
        views.push(view);
      }
    },
  });

  return views.map((view) => fullFillViewURL(view, node));
}
