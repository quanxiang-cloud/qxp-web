import { get } from 'lodash';
import {
  findNodeByID,
  getNodeParentIDs,
  travel,
} from '@one-for-all/schema-utils';
import {
  ReactComponentNode,
  RefNode,
  RouteNode,
  SchemaNode,
} from '@one-for-all/schema-spec';

import logger from '@lib/logger';

import { ExternalView, View, ViewType, SchemaView, StaticView, TableSchemaView } from '../types.d';
import { isLayoutNode } from './utils';

const VIEW_RENDER_MAP: Record<string, ViewType> = {
  TableSchemaViewRender: ViewType.TableSchemaView,
  StaticViewRender: ViewType.StaticView,
  ExternalViewRender: ViewType.ExternalView,
};

function getViewType(node: SchemaNode): ViewType | undefined {
  if (node.type === 'ref-node') {
    return ViewType.SchemaView;
  }

  if (node.type === 'react-component') {
    return VIEW_RENDER_MAP[node.exportName];
  }
}

function convertRefNodeToView(node: RefNode): SchemaView {
  return {
    id: node.id as string,
    name: node.label || '',
    type: ViewType.SchemaView,
    schemaID: node.schemaID,
    url: '',
  };
}

function convertNodeToTableView(node: ReactComponentNode): TableSchemaView {
  return {
    id: node.id as string,
    name: node.label || '',
    type: ViewType.TableSchemaView,
    tableID: get(node, 'props.tableID.value') || '',
    appID: get(node, 'props.appID.value') || '',
    url: '',
  };
}

function convertNodeToStaticView(node: ReactComponentNode): StaticView {
  return {
    id: node.id as string,
    name: node.label || '',
    type: ViewType.StaticView,
    fileUrl: get(node, 'props.fileUrl.value') || '',
    url: '',
  };
}

function convertNodeToExternalView(node: ReactComponentNode): ExternalView {
  return {
    id: node.id as string,
    name: node.label || '',
    type: ViewType.ExternalView,
    link: get(node, 'props.link.value') || '',
    appID: get(node, 'props.appID.value') || '',
    url: '',
  };
}

function convertNodeToView(node: SchemaNode): View | undefined {
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
    logger.error('todo some error message');
    break;
  }
}

function fullFillViewURL(view: View, rootNode: SchemaNode): View {
  const parentIDs = getNodeParentIDs(rootNode, view.id);
  if (!parentIDs) {
    return view;
  }

  // todo path need prefix
  const url = parentIDs
    .map((id) => findNodeByID(rootNode, id))
    .filter<SchemaNode>((node): node is SchemaNode => !!node)
    .filter((node): node is RouteNode => node.type === 'route-node')
    .map(({ path }) => path).join('/');

  return { ...view, url };
}

export default function findViews(node: SchemaNode): Array<View> {
  const views: Array<View> = [];

  travel(node, {
    routeNode: (routeNode: RouteNode) => {
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
