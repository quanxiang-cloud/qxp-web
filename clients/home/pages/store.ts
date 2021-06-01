import { observable, action, IReactionDisposer, reaction } from 'mobx';
import { TreeData } from '@atlaskit/tree';
import toast from '@lib/toast';

import { buildAppPagesTreeData } from '@lib/utils';
import AppDataStore from '@c/form-app-data-table/store';

import { fetchUserList, fetchPageList, fetchFormScheme } from '../lib/api';
import { getFlowInstanceCount } from './approvals/api';

class UserAppStore {
  destroySetCurPage: IReactionDisposer;
  @observable appList = [];
  @observable showCreateForm = false;
  @observable appID = '';
  @observable pageID = '';
  @observable appDataStore: AppDataStore = new AppDataStore({ schema: {} });
  @observable listLoading = false;
  @observable pageListLoading = true;
  @observable curPage: PageInfo = { id: '' };
  @observable fetchSchemeLoading = true;
  @observable formScheme: ISchema | null = null;
  @observable pagesTreeData: TreeData = {
    rootId: 'ROOT',
    items: {},
  };
  @observable TODO_LIST = [
    { key: 'OVERTIME', value: 0, name: '已超时', color: 'text-red-600' },
    { key: 'URGE', value: 0, name: '催办', color: 'text-yellow-600' },
    { key: '', value: 0, name: '全部待办', color: 'text-gray-900' },
  ];
  @observable HANDLE_LIST = [
    { key: 0, name: '我发起的', icon: 'addchart', link: 'my_applies' },
    { key: 1, name: '我已处理', icon: 'done_all', link: 'done' },
    { key: 2, name: '抄送给我', icon: 'send_me', count: 0, link: 'cc_to_me' },
  ];

  constructor() {
    this.destroySetCurPage = reaction(() => {
      if (!this.pageID || this.pageListLoading || !this.pagesTreeData.items[this.pageID]) {
        return;
      }

      return this.pagesTreeData.items[this.pageID].data;
    }, this.setCurPage);
  }

  @action
  setShowCreateForm = (showCreateForm: boolean) => {
    this.showCreateForm = showCreateForm;
  }

  @action
  fetchPageList = (appID: string) => {
    this.appID = appID;
    this.pageListLoading = true;
    fetchPageList(appID).then((res: any) => {
      this.pagesTreeData = buildAppPagesTreeData(res.menu);
      this.pageListLoading = false;
    });
  }

  @action
  setPageID = (pageID: string) => {
    this.pageID = pageID;
  }

  @action
  setCurPage = (pageInfo: PageInfo) => {
    if (!pageInfo) {
      return;
    }

    this.showCreateForm = false;
    this.formScheme = null;
    this.fetchSchemeLoading = true;
    fetchFormScheme(this.appID, pageInfo.id).then((res: any) => {
      const { config, schema } = res || {};
      if (schema) {
        Object.keys(schema.properties).forEach((key) => {
          if (schema.properties[key]['x-internal'].permission === 1) {
            schema.properties[key].readOnly = true;
          }
        });

        this.appDataStore = new AppDataStore({
          schema: schema,
          config: config,
          pageID: pageInfo.id,
          pageName: pageInfo.name,
          appID: this.appID,
          allowRequestData: true,
          createFun: () => this.setShowCreateForm(true),
        });
      }
      this.formScheme = res.schema;
      this.fetchSchemeLoading = false;
    }).catch(() => {
      this.fetchSchemeLoading = false;
    });
    this.curPage = pageInfo;
  }

  @action
  fetchAppList = () => {
    this.listLoading = true;
    return fetchUserList().then((res: any) => {
      this.listLoading = false;
      this.appList = res.data || [];
    }).catch(() => {
      this.listLoading = false;
    });
  }

  @action
  clear = () => {
    this.formScheme = null;
    this.pageListLoading = true;
    this.pagesTreeData = {
      rootId: 'ROOT',
      items: {},
    };
    this.curPage = { id: '' };
  }

  @action
  fetchTodoList = async () => {
    try {
      const {
        overTimeCount = 0,
        urgeCount = 0,
        waitHandleCount = 0,
        ccToMeCount = 0,
      } = await getFlowInstanceCount({ 'User-Id': window.USER.id });
      this.TODO_LIST[0].value = overTimeCount;
      this.TODO_LIST[1].value = urgeCount;
      this.TODO_LIST[2].value = waitHandleCount;
      this.HANDLE_LIST[2].count = ccToMeCount;
    } catch (err) {
      toast.error(err);
    }
  }
}

export default new UserAppStore();
