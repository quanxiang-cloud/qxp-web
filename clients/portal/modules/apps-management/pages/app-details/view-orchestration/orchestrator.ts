import { get } from 'lodash';
import { action, computed, observable } from 'mobx';
import {
  ReactComponentNode,
  SchemaNode,
  Schema,
  APIStatesSpec,
  SharedStatesSpec,
} from '@one-for-all/schema-spec';
import { deleteByID, findNodeByID, patchNode } from '@one-for-all/schema-utils';

import addLayoutToRoot from './helpers/add-layout-to-root';
import addViewToRoot from './helpers/add-view-to-root';
import addViewToLayout from './helpers/add-view-to-layout';
import findLayouts from './helpers/find-layouts';
import findViews from './helpers/find-views';
import {
  findFirstRouteParentID,
  genNodeID,
  genDesktopRootViewSchemaKey,
  saveSchema,
} from './helpers/utils';
import type {
  Layout,
  View,
  ViewGroup,
  LayoutType,
  CreateViewParams,
  ExternalView,
} from './types';
import { ROOT_NODE_ID } from './constants';

class Orchestrator {
  @observable loading = true;
  @observable rootNode: SchemaNode;
  appID: string;
  rootSchemaKey: string;
  apiStateSpec: APIStatesSpec | undefined;
  sharedStatesSpec: SharedStatesSpec | undefined;
  appLayout: LayoutType | undefined;

  constructor(appID: string, rootSchema: Schema) {
    this.appID = appID;
    this.rootSchemaKey = genDesktopRootViewSchemaKey(appID);

    const { node, apiStateSpec, sharedStatesSpec } = rootSchema;

    this.rootNode = node;
    this.apiStateSpec = apiStateSpec;
    this.sharedStatesSpec = sharedStatesSpec;

    const _rootNOde = findNodeByID(node, ROOT_NODE_ID);
    this.appLayout = get(_rootNOde, 'props.data-layout-type.value', undefined);
  }

  @computed get layouts(): Array<Layout> {
    if (!this.rootNode) {
      return [];
    }

    // todo filter root layout
    return findLayouts(this.rootNode);
  }

  @computed get views(): Array<View | ViewGroup> {
    if (!this.rootNode) {
      return [];
    }

    return findViews(this.rootNode);
  }

  // async createGroup(name: string): FutureErrorMessage {

  // }

  // async renameGroup(oldName: string, newName: string): FutureErrorMessage {

  // }

  // async deleteGroup(name: string): FutureErrorMessage {

  // }

  // async changeViewGroup(viewID: string, from: string, to?: string): FutureErrorMessage {

  // }

  async addLayout(name: string, layoutType: LayoutType): FutureErrorMessage {
    const rootNode = await addLayoutToRoot({
      appID: this.appID,
      rootNode: this.rootNode,
      layoutType,
      layoutName: name,
    });

    return this.saveSchema(rootNode);
  }

  async addTableSchemaView(params: CreateViewParams): FutureErrorMessage {
    if (!this.rootNode) {
      return 'no root node found for this app, please init root node again!';
    }

    // todo create empty table schema?
    const tableID = 'todo_implement_this';
    const renderTableSchemaViewNode: ReactComponentNode = {
      id: genNodeID(),
      type: 'react-component',
      // todo implement this
      packageName: 'todo_implement_this',
      // todo implement this
      packageVersion: 'todo_implement_this',
      // todo implement this
      exportName: 'todo_implement_this',
      props: {
        tableID: {
          type: 'constant_property',
          value: tableID,
        },
      },
    };

    if (!params.layoutID) {
      return this.saveSchema(addViewToRoot(this.rootNode, renderTableSchemaViewNode));
    }

    const rootNode = addViewToLayout(this.rootNode, params.layoutID, renderTableSchemaViewNode);

    return this.saveSchema(rootNode);
  }

  async addSchemaView(params: CreateViewParams): FutureErrorMessage {
    return Promise.reject(new Error('todo, implement this'));
  }

  async addStaticView(params: CreateViewParams & { fileUrl: string; }): FutureErrorMessage {
    return Promise.reject(new Error('todo, implement this'));
  }
  async addExternalView(params: CreateViewParams & { link: string; }): FutureErrorMessage {
    return Promise.reject(new Error('todo, implement this'));
  }

  // async editTableSchemaView(view: TableSchemaView): FutureErrorMessage;
  // async editSchemaView(view: SchemaView): FutureErrorMessage;
  // async editStaticView(view: StaticView): FutureErrorMessage;

  async editExternalView(view: ExternalView): FutureErrorMessage {
    if (!this.rootNode) {
      return 'no root node found for this app, please init root node again!';
    }

    const externalViewNode: ReactComponentNode = {
      id: view.id,
      label: view.name,
      type: 'react-component',
      packageName: 'todo_implement_this',
      packageVersion: 'todo_implement_this',
      exportName: 'todo_implement_this',
      props: {
        link: { type: 'constant_property', value: view.link },
      },
    };

    const rootNode = patchNode(this.rootNode, externalViewNode);
    return this.saveSchema(rootNode);
  }

  async deleteViewOrLayout(id: string): FutureErrorMessage {
    const routeNodeID = findFirstRouteParentID(this.rootNode, id);
    if (!routeNodeID) {
      return '';
    }

    return this.saveSchema(deleteByID(this.rootNode, routeNodeID));
  }

  @action
  async saveSchema(rootNode: SchemaNode | undefined): FutureErrorMessage {
    if (!rootNode) {
      // todo implement this!!!
      return Promise.resolve('todo some error message');
    }

    this.loading = true;
    this.rootNode = rootNode;

    return saveSchema(this.rootSchemaKey, {
      node: this.rootNode,
      apiStateSpec: this.apiStateSpec,
      sharedStatesSpec: this.sharedStatesSpec,
    }).then(() => {
      this.loading = false;
      return '';
    });
  }
}

export default Orchestrator;
