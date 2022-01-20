import { observable, action } from 'mobx';

import toast from '@lib/toast';

import { fetchTemplateList, TemplateListRes, deleteTemplate } from './api';

export type TemplateInfo = AppInfo & {
  name: string;
}

class TemplateStore {
  @observable templateList: TemplateInfo[] = [];
  @observable curTemplate: TemplateInfo = {} as any;

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
}

export default new TemplateStore();
