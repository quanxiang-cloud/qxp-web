import { observable, action } from 'mobx';

import toast from '@lib/toast';

import { fetchTemplateList, TemplateListRes, deleteTemplate, saveAppAsTemplate, editTemplateInfo } from './api';

export type TemplateInfo = AppInfo & {
  name: string;
}

class TemplateStore {
  @observable templateList: TemplateInfo[] = [];
  @observable curTemplate: TemplateInfo | undefined = undefined;

  @action
  setCurTemplate = (template: TemplateInfo): void => {
    this.curTemplate = template;
  };

  @action
  fetchList = (): void => {
    fetchTemplateList().then((res: TemplateListRes) => {
      this.templateList = res.templates;
    }).catch(() => {
      toast.error('获取模版列表失败');
    });
  };

  @action
  delTemplate = async (tmpId: string): Promise<void> => {
    return await deleteTemplate(tmpId).then(() => {
      this.templateList = this.templateList.filter(({ id }) => id !== tmpId);
      toast.success('模版删除成功');
    }).catch(() => {
      toast.error('模版删除成功');
    });
  };

  @action
  addTemplate = async (tmpInfo: TemplateInfo): Promise<void> => {
    return await saveAppAsTemplate(
      { appID: tmpInfo.id, name: tmpInfo.name, appIcon: tmpInfo.appIcon },
      `【${tmpInfo.name}】 模版新建`,
    ).then(() => {
      toast.success('模版保存中');
    }).catch((err) => {
      toast.error('模版保存失败: ', err.message);
    });
  };

  @action
  editTemplate = async (id: string, name: string, appIcon: string): Promise<void> => {
    return await editTemplateInfo(id, name, appIcon).then(() => {
      toast.success('修改成功');
      this.fetchList();
    }).catch(() => {
      toast.error('修改失败');
    });
  };
}

export default new TemplateStore();
