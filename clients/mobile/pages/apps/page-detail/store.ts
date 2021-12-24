import { action, computed, observable } from 'mobx';

import { FetchPageListResponse, Menu } from '@m/pages/apps/types';
import { CustomPageInfo, MenuType } from '@portal/modules/apps-management/pages/app-details/type';
import { fetchPageList, getOperate } from '@home/pages/app-details/api';
import { delFormDataRequest, fetchFormDataList, getCustomPageInfo, getTableSchema } from '@lib/http-client';
import { getOperateButtonPer } from '@home/pages/app-details/utils';
import toast from '@lib/toast';
import { Task } from '@m/pages/approvals/types';
import { getFlowSummary } from '@m/lib/value-render';
import { mapMenu } from '../utils';

class AppDetailStore {
  @observable state = { loading: false, error: '' };
  @observable page?: Menu;
  @observable customPageInfo?: CustomPageInfo;
  @observable authority?: number;
  @observable schema?: ISchema;

  // For app detail list loading
  @observable currentPage = 0;
  private readonly limit = 20;
  @observable finished = false;
  @observable inited = false;
  @observable list: Task[] = [];

  @computed get canUpdate(): boolean {
    return this.authority ? getOperateButtonPer(3, this.authority) : false;
  }
  @computed get canDelete(): boolean {
    return this.authority ? getOperateButtonPer(4, this.authority) : false;
  }

  @action setup = (page: Menu): void => {
    this.page = page;
  }

  @action init = (appId: string, pageId: string): void => {
    if (this.page?.appID === appId && this.page?.id === pageId) {
      this.initPageDetail();
    } else {
      this.initPage(appId, pageId);
    }
  }

  @action initPage = (appId: string, pageId: string): void => {
    this.state = { loading: true, error: '' };
    fetchPageList(appId).then((res) => {
      const menu = mapMenu(res as FetchPageListResponse);
      const page = menu?.find((m) => m.id === pageId && m.appID === appId);
      if (page) {
        this.page = page;
        this.initPageDetail();
      } else {
        this.state = { loading: false, error: '获取页面信息失败' };
      }
    }).catch(() => {
      this.state = { loading: false, error: '获取页面列表失败' };
    });
  }

  @action initPageDetail = (): void => {
    if (!this.page) return;
    switch (this.page.menuType) {
    case MenuType.customPage:
      this.initCustomPage();
      break;
    case MenuType.schemaForm:
      this.initSchemaForm();
      break;
    default:
      this.state = { loading: false, error: '页面不存在' };
    }
  }

  @action initCustomPage = (): void => {
    if (!this.page) return;
    const appID = this.page.appID;
    const pageID = this.page.id;

    this.state = { loading: true, error: '' };
    getCustomPageInfo(appID, pageID).then((res) => {
      this.state = { loading: false, error: '' };
      this.customPageInfo = res;
    }).catch((e) => {
      this.state = { loading: false, error: e.message };
    });
  }

  @action initSchemaForm = (): void => {
    if (this.authority === undefined) this.initAuthority();
    this.initTables();
  }

  @action initAuthority = (): void => {
    if (!this.page) return;
    const appID = this.page.appID;
    const pageID = this.page.id;
    this.state = { loading: true, error: '' };
    getOperate<{ authority?: number }>(appID, pageID).then((authorityRef) => {
      this.authority = authorityRef?.authority || 0;
    }).catch(() => {
      this.state = { loading: false, error: '加载失败' };
    });
  }

  @action initTables = async (): Promise<void> => {
    if (!this.page) return;
    const appID = this.page.appID;
    const pageID = this.page.id;
    this.state = { loading: true, error: '' };
    try {
      if (!this.schema) {
        const res = await getTableSchema(appID, pageID);
        if (!res) {
          this.state = { loading: false, error: '加载失败' };
          return;
        }
        this.schema = res.schema;
        this.state = { loading: false, error: '' };
      }
    } catch {
      this.state = { loading: false, error: '加载失败' };
    }
  }

  @action loadTables = async (pageKey: number): Promise<void> => {
    if (!this.page) return;
    const appID = this.page.appID;
    const pageID = this.page.id;
    const res = await fetchFormDataList(appID, pageID, {
      sort: ['-created_at'],
      page: pageKey,
      size: this.limit,
    }).catch((e) => {
      toast.error(e);
      if (!this.inited) this.inited = true;
      throw e;
    });

    const tables = res.entities?.map((entry) => ({
      creatorName: entry['creator_name'],
      creatorId: entry['creator_id'],
      id: entry['_id'],
      flowSummaryPair: getFlowSummary(entry, this.schema),
    })) || [];
    if (pageKey < 2) {
      this.list = tables as Task[];
    } else {
      this.list = this.list.concat(tables as Task[]);
    }
    this.currentPage = pageKey;
    this.finished = tables.length < this.limit;
    if (!this.inited) this.inited = true;
  }

  @action delete = async (id: string): Promise<boolean> => {
    if (!this.page) {
      toast.error('页面尚未初始化，请刷新重试');
      return false;
    }
    const appID = this.page.appID;
    const pageID = this.page.id;
    const ids = [id];
    const data = await delFormDataRequest(appID, pageID, ids);
    try {
      if (data.errorCount && data.errorCount === ids.length) {
        toast.error('删除失败！没有权限');
        return false;
      }

      if (data.errorCount) {
        toast.success(`删除成功, 成功${ids.length - data.errorCount}条, 失败${data.errorCount}条`);
        this.loadTables(1);
        return false;
      }
      const index = this.list.findIndex((task) => task.id === id);
      if (index > -1) {
        this.list.splice(index, 1);
      }
      toast.success('删除成功!');
      return true;
    } catch (e) {
      toast.error(e);
    }
    return false;
  }

  @action clear = (): void => {
    this.state = { loading: false, error: '' };
    this.page = undefined;
    this.customPageInfo = undefined;
    this.authority = undefined;
    this.schema = undefined;

    // For app detail list loading
    this.currentPage = 0;
    this.finished = false;
    this.inited = false;
    this.list = [];
  }
}

export default new AppDetailStore();
