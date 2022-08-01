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

import { getTableSchema, saveTableSchema } from '@lib/http-client-form';
import versionMap from '@pageDesign/blocks/fountainhead/config/name-version-map';

import addLayoutToRoot, { copyLayoutToRoot, CreateLayoutInfo } from './helpers/add-layout-to-root';
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
  TableSchemaView,
  ViewType,
} from './types.d';
import { ROOT_NODE_ID } from './constants';
import { createBlank } from '../api';
import pageTemplatesStore from '@portal/modules/apps-management/page-templates/store';
import appStore from '../store';

class Orchestrator {
  @observable loading = true;
  @observable rootNode: Node;
  @observable currentView?: View | ViewGroup;
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

    if (!appStore.appDetails.accessURL && this.views.length === 1) {
      this.currentView = this.views[0];
      this.setHomeView((this.views[0] as View).id);
      return;
    }

    const view = this.views.find((view) => (view as View).url === appStore.appDetails.accessURL);
    this.homeView = view as View;

    if (this.homeView && !appStore.lastFocusViewID) {
      this.currentView = this.homeView;
    }
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

    return findViews(this.rootNode).sort((viewA, viewB) => {
      return viewA.name < viewB.name ? -1 : 1;
    });
  }

  @action
  async addLayout(layoutInfo: CreateLayoutInfo): FutureErrorMessage {
    const rootNode = await addLayoutToRoot({
      appID: this.appID,
      rootNode: toJS(this.rootNode),
      layoutInfo,
    });

    return this.saveSchema(rootNode);
  }

  @action
  async copyLayout(layout: Layout): FutureErrorMessage {
    const copiedLayoutName = this.createCopyLayoutName(layout.name);
    const rootNode = await copyLayoutToRoot({
      appID: this.appID,
      rootNode: toJS(this.rootNode),
      layoutInfo: { ...layout, name: copiedLayoutName },
      refSchemaID: layout.refSchemaID,
    });

    return this.saveSchema(rootNode);
  }

  createCopyLayoutName(name: string): string {
    const copyLayoutName = name + '的副本';
    const extLayout = this.layouts.find((layout) => layout.name === copyLayoutName);
    if (!extLayout) return copyLayoutName;
    return this.createCopyLayoutName(extLayout.name);
  }

  @action
  async editLayout(partialLayoutInfo: Pick<Layout, 'name' | 'description' | 'id'>): FutureErrorMessage {
    const layoutList = get(this.rootNode, 'node.children[1].children', []);
    const index = findIndex(
      layoutList,
      (layoutItem: RouteNode) => layoutItem.node.id === partialLayoutInfo.id,
    );

    set(this.rootNode, `node.children[1].children[${index}].node.label`, partialLayoutInfo.name);
    set(this.rootNode, `node.children[1].children[${index}].node.props.data-layout-description`, {
      // temp description ,should remove soon
      type: 'constant_property',
      value: partialLayoutInfo.description,
    });

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

  async addTableSchemaView(pageName: string, layoutID?: string, tableSchema?: ISchema): FutureErrorMessage {
    if (!this.rootNode) {
      return 'no root node found for this app, please init root node again!';
    }

    const { tableID } = await createBlank(this.appID);
    if (tableSchema) {
      await saveTableSchema(this.appID, tableID, tableSchema);
    }

    const renderTableSchemaViewNode: ReactComponentNode = {
      id: genNodeID(),
      type: 'react-component',
      label: pageName,
      // todo implement this
      packageName: 'SimpleViewRenders',
      // todo implement this
      packageVersion: versionMap.SimpleViewRenders,
      // todo implement this
      exportName: 'TableSchemaViewRender',
      props: {
        tableID: {
          type: 'constant_property',
          value: tableID,
        },
        name: {
          type: 'constant_property',
          value: pageName,
        },
        appID: {
          type: 'constant_property',
          value: this.appID,
        },
      },
    };
    appStore.setLastFocusViewID(renderTableSchemaViewNode.id);

    if (!layoutID) {
      return this.saveSchema(addViewToRoot(this.rootNode, renderTableSchemaViewNode));
    }

    const rootNode = addViewToLayout(this.rootNode, layoutID, renderTableSchemaViewNode);

    return this.saveSchema(rootNode);
  }

  async addSchemaView(pageName: string, layoutID?: string, artery?: Artery): FutureErrorMessage {
    if (!this.rootNode) {
      return 'no root node found for this app, please init root node again!';
    }

    const pageSchemaKey = genDesktopArteryKey(this.appID);
    const customPageSchema: Artery = artery ?? {
      node: {
        id: genNodeID(),
        label: pageName,
        type: 'html-element',
        name: 'div',
      },
    };

    await saveArtery(pageSchemaKey, customPageSchema);

    const renderSchemaView: RefNode = {
      id: genNodeID(),
      type: 'ref-node',
      arteryID: pageSchemaKey,
      label: pageName,
    };

    appStore.setLastFocusViewID(renderSchemaView.id);

    if (!layoutID) {
      return this.saveSchema(addViewToRoot(this.rootNode, renderSchemaView));
    }

    const rootNode = addViewToLayout(this.rootNode, layoutID, renderSchemaView);

    return this.saveSchema(rootNode);
  }

  async addStaticView(params: CreateViewParams<StaticView>): FutureErrorMessage {
    const staticViewNode: ReactComponentNode = {
      id: genNodeID(),
      type: 'react-component',
      label: params.name,
      // todo implement this
      packageName: 'SimpleViewRenders',
      // todo implement this
      packageVersion: versionMap.SimpleViewRenders,
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

    appStore.setLastFocusViewID(staticViewNode.id);

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
      packageVersion: versionMap.SimpleViewRenders,
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

    appStore.setLastFocusViewID(externalViewNode.id);

    if (!params.layoutID) {
      return this.saveSchema(addViewToRoot(this.rootNode, externalViewNode));
    }

    const rootNode = addViewToLayout(this.rootNode, params.layoutID, externalViewNode);
    return this.saveSchema(rootNode);
  }

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

    return this.saveSchema(deleteByID(this.rootNode, routeNodeID)).then((errorMsg) => {
      this.setCurrentView(this.views[0]);
      return errorMsg;
    });
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
  async handleViewInfoSubmit(viewInfo: CreateViewParams<View>): Promise<void> {
    if (this.modalType === 'createView') {
      if (viewInfo.type === ViewType.TableSchemaView) {
        await this.addTableSchemaView(viewInfo.name, viewInfo.layoutID);
      }

      if (viewInfo.type === ViewType.SchemaView) {
        await this.addSchemaView(viewInfo.name, viewInfo.layoutID);
      }

      if (viewInfo.type === ViewType.StaticView) {
        await this.addStaticView(viewInfo as CreateViewParams<StaticView>);
      }
      if (viewInfo.type === ViewType.ExternalView) {
        await this.addExternalView(viewInfo as CreateViewParams<ExternalView>);
      }

      return;
    }

    if (this.modalType === 'editStaticView') {
      await this.editStaticView(viewInfo as StaticView);
    }

    if (viewInfo.type === ViewType.ExternalView && this.modalType === 'editView') {
      await this.editExternalView(viewInfo as ExternalView);
    }

    if (viewInfo.type === ViewType.TableSchemaView && this.modalType === 'editView') {
      const { tableID } = viewInfo;
      // here modify table name first ,
      // because there is a condition:
      //  when schema label modified success and table name failed
      //  edit modal will not close, and if submit again the edited name will be duplicated
      await getTableSchema(this.appID, tableID)
        .then((res) => {
          if (!res) return;
          const { schema, tableID } = res;
          const updatedNameSchema = { ...schema, title: viewInfo.name };
          return saveTableSchema(this.appID, tableID, updatedNameSchema);
        })
        .then(() => this.editTableSchemaView(viewInfo as TableSchemaView));
    }

    await this.updateViewName(this.currentView as View, viewInfo.name!);

    if (viewInfo.id) {
      this.setCurrentView(viewInfo);
      return;
    }

    const view = this.views.find((view) => view.name === viewInfo.name);
    this.setCurrentView(view as View);
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
  setHomeView(id?: string): Promise<void> {
    const view = this.views.find((view) => (view as View).id === id) as View;

    if (!view) {
      throw new Error('view is not found');
    }

    this.homeView = view;
    return appStore.setAccessURL(view.url);
  }

  async addPageFromTemplate(templateKey: string, name: string, layoutID?: string): FutureErrorMessage {
    const template = pageTemplatesStore.pageTemplates.find(({ key }) => key === templateKey);
    if (!template) {
      return Promise.resolve('模板未找到');
    }

    if (template.type === 'form') {
      return this.addTableSchemaView(name, layoutID, template.schema);
    }

    if (template.type === 'artery') {
      return this.addSchemaView(name, layoutID, template.artery);
    }

    return '';
  }
}

export default Orchestrator;
