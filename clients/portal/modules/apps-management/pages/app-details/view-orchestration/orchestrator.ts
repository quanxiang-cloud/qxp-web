import { get, set, findIndex } from 'lodash';
import { action, computed, observable, toJS } from 'mobx';
import {
  RouteNode,
  Artery,
  RefNode,
  Node,
  APIStatesSpec,
  SharedStatesSpec,
  ReactComponentNode,
} from '@one-for-all/artery';
import { deleteByID, findNodeByID, patchNode } from '@one-for-all/artery-utils';

import addLayoutToRoot from './helpers/add-layout-to-root';
import addViewToRoot from './helpers/add-view-to-root';
import addViewToLayout from './helpers/add-view-to-layout';
import findLayouts from './helpers/find-layouts';
import findViews from './helpers/find-views';
import {
  findFirstRouteParentID,
  genNodeID,
  genDesktopRootArteryKey,
  saveArtery,
  genDesktopArteryKey,
} from './helpers/utils';
import {
  Layout,
  View,
  ViewGroup,
  LayoutType,
  CreateViewParams,
  ExternalView,
  StaticView,
  SchemaView,
  TableSchemaView,
  ViewType,
} from './types.d';
import { ROOT_NODE_ID } from './constants';
import { createBlank, fetchAppDetails, updateApp } from '../api';

class Orchestrator {
  @observable loading = true;
  @observable rootNode: Node;
  @observable currentView: View | ViewGroup;
  @observable homeView?: View;
  @observable modalType = '';
  appID: string;
  rootSchemaKey: string;
  apiStateSpec: APIStatesSpec | undefined;
  sharedStatesSpec: SharedStatesSpec | undefined;
  appLayout: LayoutType | undefined;

  constructor(appID: string, rootSchema: Artery) {
    this.appID = appID;
    this.rootSchemaKey = genDesktopRootArteryKey(appID);
    const { node, apiStateSpec, sharedStatesSpec } = rootSchema;

    this.rootNode = node;
    this.apiStateSpec = apiStateSpec;
    this.sharedStatesSpec = sharedStatesSpec;

    const _rootNOde = findNodeByID(node, ROOT_NODE_ID);
    this.appLayout = get(_rootNOde, 'props.data-layout-type.value', undefined);

    this.currentView = this.views[0];
    this.fetchAppHomeView(appID);
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

  @action
  async addLayout(name: string, layoutType: LayoutType): FutureErrorMessage {
    const rootNode = await addLayoutToRoot({
      appID: this.appID,
      rootNode: toJS(this.rootNode),
      layoutType,
      layoutName: name,
    });

    return this.saveSchema(rootNode);
  }

  @action
  async editLayout(layoutID: string, name: string): FutureErrorMessage {
    const layoutList = get(this.rootNode, 'node.children[1].children', []);
    const index = findIndex(layoutList, (layoutItem: RouteNode) => layoutItem.node.id === layoutID);
    const oldName = get(this.rootNode, `node.children[1].children[${index}].node.label`, '');

    if (oldName === name) {
      return 'No changes were made';
    }

    set(this.rootNode, `node.children[1].children[${index}].node.label`, name);
    return this.saveSchema(this.rootNode);
  }

  @action
  async updateViewName(view: View, name: string): FutureErrorMessage {
    if (!this.rootNode) {
      return 'no root node found for this app, please init root node again!';
    }

    const targetNode = findNodeByID(this.rootNode, view.id);

    if (!targetNode) {
      return 'target node not found';
    }

    const rootNode = patchNode(this.rootNode, { ...targetNode, label: name });

    return this.saveSchema(rootNode);
  }

  async addTableSchemaView(params: CreateViewParams<TableSchemaView>): FutureErrorMessage {
    if (!this.rootNode) {
      return 'no root node found for this app, please init root node again!';
    }
    let renderTableSchemaViewNode: ReactComponentNode;
    return createBlank(this.appID).then(({ tableID: id }) => {
      // todo create empty table schema?
      const tableID = id;
      renderTableSchemaViewNode = {
        id: genNodeID(),
        type: 'react-component',
        label: params.name,
        // todo implement this
        packageName: 'SimpleViewRenders',
        // todo implement this
        packageVersion: '1.0.0',
        // todo implement this
        exportName: 'TableSchemaViewRender',
        props: {
          tableID: {
            type: 'constant_property',
            value: tableID,
          },
          name: {
            type: 'constant_property',
            value: params.name,
          },
          appID: {
            type: 'constant_property',
            value: this.appID,
          },
        },
      };

      if (!params.layoutID) {
        return this.saveSchema(addViewToRoot(this.rootNode, renderTableSchemaViewNode));
      }

      const rootNode = addViewToLayout(this.rootNode, params.layoutID, renderTableSchemaViewNode);

      return this.saveSchema(rootNode);
    });
  }

  async addSchemaView(params: CreateViewParams<SchemaView>): FutureErrorMessage {
    if (!this.rootNode) {
      return 'no root node found for this app, please init root node again!';
    }
    let renderSchemaView: RefNode;

    const pageSchemaKey = genDesktopArteryKey(this.appID);
    const customPageSchema: Artery = {
      node: {
        id: genNodeID(),
        type: 'react-component',
        packageName: 'ofa-ui',
        packageVersion: 'latest',
        exportName: 'page',
        label: params.name,
        props: {
          style: {
            type: 'constant_property',
            value: {
              width: '100%',
              height: '100%',
            },
          },
        },
        children: [],
      },
      apiStateSpec: {},
      sharedStatesSpec: {},
    };
    return saveArtery(pageSchemaKey, customPageSchema).then(() => {
      renderSchemaView = {
        id: genNodeID(),
        type: 'ref-node',
        arteryID: pageSchemaKey,
        label: params.name,
      };

      if (!params.layoutID) {
        return this.saveSchema(addViewToRoot(this.rootNode, renderSchemaView));
      }

      const rootNode = addViewToLayout(this.rootNode, params.layoutID, renderSchemaView);

      return this.saveSchema(rootNode);
    });
  }

  async addStaticView(params: CreateViewParams<StaticView>): FutureErrorMessage {
    const staticViewNode: ReactComponentNode = {
      id: genNodeID(),
      type: 'react-component',
      label: params.name,
      // todo implement this
      packageName: 'SimpleViewRenders',
      // todo implement this
      packageVersion: '1.0.0',
      // todo implement this
      exportName: 'StaticViewRender',
      props: {
        fileUrl: {
          type: 'constant_property',
          value: params.fileUrl,
        },
        name: {
          type: 'constant_property',
          value: params.name,
        },
      },
    };

    return Promise.resolve().then(() => {
      if (!params.layoutID) {
        return this.saveSchema(addViewToRoot(this.rootNode, staticViewNode));
      }

      const rootNode = addViewToLayout(this.rootNode, params.layoutID, staticViewNode);

      return this.saveSchema(rootNode);
    });
  }

  async addExternalView(params: CreateViewParams<ExternalView>): FutureErrorMessage {
    const externalViewNode: ReactComponentNode = {
      id: genNodeID(),
      type: 'react-component',
      label: params.name,
      // todo implement this
      packageName: 'SimpleViewRenders',
      // todo implement this
      packageVersion: '1.0.0',
      // todo implement this
      exportName: 'ExternalViewRender',
      props: {
        link: {
          type: 'constant_property',
          value: params.link,
        },
        name: {
          type: 'constant_property',
          value: params.name,
        },
        appID: {
          type: 'constant_property',
          value: this.appID,
        },
      },
    };

    if (!params.layoutID) {
      return this.saveSchema(addViewToRoot(this.rootNode, externalViewNode));
    }

    const rootNode = addViewToLayout(this.rootNode, params.layoutID, externalViewNode);
    return this.saveSchema(rootNode);
  }

  // async editTableSchemaView(view: TableSchemaView): FutureErrorMessage {

  // };
  // async editSchemaView(view: SchemaView): FutureErrorMessage;
  // async editStaticView(view: StaticView): FutureErrorMessage;

  @action
  async editTableSchemaView(view: TableSchemaView): FutureErrorMessage {
    if (!this.rootNode) {
      return 'no root node found for this app, please init root node again!';
    }

    const targetNode = findNodeByID(this.rootNode, view.id);

    if (!targetNode) {
      return 'target node not found';
    }

    const tableSchemaViewNode: ReactComponentNode = {
      ...(targetNode as ReactComponentNode),
      label: view.name,
      props: {
        ...targetNode.props,
        name: { type: 'constant_property', value: view.name },
      },
    };

    const rootNode = patchNode(this.rootNode, tableSchemaViewNode);
    return this.saveSchema(rootNode);
  }

  @action
  async editStaticView(view: StaticView): FutureErrorMessage {
    if (!this.rootNode) {
      return 'no root node found for this app, please init root node again!';
    }

    const targetNode = findNodeByID(this.rootNode, view.id);

    if (!targetNode) {
      return 'target node not found';
    }

    const externalViewNode: ReactComponentNode = {
      ...(targetNode as ReactComponentNode),
      label: view.name,
      props: {
        fileUrl: { type: 'constant_property', value: view.fileUrl },
      },
    };

    const rootNode = patchNode(this.rootNode, externalViewNode);
    return this.saveSchema(rootNode);
  }

  @action
  async editExternalView(view: ExternalView): FutureErrorMessage {
    if (!this.rootNode) {
      return 'no root node found for this app, please init root node again!';
    }

    const targetNode = findNodeByID(this.rootNode, view.id);

    if (!targetNode) {
      return 'target node not found';
    }

    const externalViewNode: ReactComponentNode = {
      ...(targetNode as ReactComponentNode),
      label: view.name,
      props: {
        link: { type: 'constant_property', value: view.link },
      },
    };

    const rootNode = patchNode(this.rootNode, externalViewNode);
    return this.saveSchema(rootNode);
  }

  @action
  async deleteViewOrLayout(id: string): FutureErrorMessage {
    const routeNodeID = findFirstRouteParentID(this.rootNode, id);
    if (!routeNodeID) {
      return '';
    }

    return this.saveSchema(deleteByID(this.rootNode, routeNodeID));
  }

  @action
  async saveSchema(rootNode: Node | undefined): FutureErrorMessage {
    if (!rootNode) {
      return Promise.resolve('App rootNode is null');
    }

    this.loading = true;
    this.rootNode = rootNode;

    return saveArtery(this.rootSchemaKey, {
      node: this.rootNode,
      apiStateSpec: this.apiStateSpec,
      sharedStatesSpec: this.sharedStatesSpec,
    }).then(() => {
      this.loading = false;
      return '';
    });
  }

  @action
  handleViewInfoSubmit(
    viewInfo: CreateViewParams<View>,
  ): Promise<void> {
    return Promise.resolve().then(() => {
      if (this.modalType === 'createView') {
        if (viewInfo.type === ViewType.TableSchemaView) {
          return this.addTableSchemaView(viewInfo as CreateViewParams<TableSchemaView>);
        }

        if (viewInfo.type === ViewType.SchemaView) {
          return this.addSchemaView(viewInfo as CreateViewParams<SchemaView>);
        }

        if (viewInfo.type === ViewType.StaticView) {
          return this.addStaticView(viewInfo as CreateViewParams<StaticView>);
        }
        if (viewInfo.type === ViewType.ExternalView) {
          return this.addExternalView(viewInfo as CreateViewParams<ExternalView>);
        }
      }

      if (this.modalType === 'editStaticView') {
        return this.editStaticView(viewInfo as StaticView);
      }

      if (viewInfo.type === ViewType.ExternalView && this.modalType === 'editView') {
        return this.editExternalView(viewInfo as ExternalView);
      }

      if (viewInfo.type === ViewType.TableSchemaView && this.modalType === 'editView') {
        return this.editTableSchemaView(viewInfo as TableSchemaView);
      }

      return this.updateViewName(this.currentView as View, viewInfo.name!);
    }).then(() => {
      if (this.modalType === 'createView' && this.views.length === 1) {
        this.setHomeView(viewInfo.name);
      }
      if (viewInfo.id) {
        this.setCurrentView(viewInfo);
        return;
      }
      const view = this.views.find((view) => view.name === viewInfo.name);
      this.setCurrentView(view as View);
    });
  }

  @action
  setModalType(modalType: string): void {
    this.modalType = modalType;
  }

  @action
  setCurrentView(view: View | ViewGroup): void {
    this.currentView = view;
  }

  @action
  saveAppHomeViewUrl(url: string): Promise<unknown> {
    return updateApp({
      id: this.appID,
      accessURL: url,
    });
  }

  @action
  setHomeView(viewName?: string): Promise<unknown> {
    const view = this.views.find((view) => view.name === viewName) as View;

    if (!view) {
      throw new Error('view is not found');
    }

    this.homeView = view;
    return this.saveAppHomeViewUrl(view.url);
  }

  @action
  fetchAppHomeView(id: string): void {
    fetchAppDetails(id).then(({ accessURL }) => {
      const view = this.views.find((view) => (view as View).url === accessURL);
      this.homeView = view as View;
    });
  }
}

export default Orchestrator;
