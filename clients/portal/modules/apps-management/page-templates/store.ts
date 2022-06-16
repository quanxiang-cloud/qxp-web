import { getBatchGlobalConfig, GetParams, setBatchGlobalConfig } from '@lib/api/user-config';
import httpClient from '@lib/http-client';
import { getTableSchema } from '@lib/http-client-form';
import toast from '@lib/toast';
import { parseJSON, uuid } from '@lib/utils';
import type { Artery } from '@one-for-all/artery';
import dayjs from 'dayjs';
import { action, observable } from 'mobx';

export interface FormPageTemplate {
  type: 'form';
  key: string;
  name: string;
  schema: ISchema;
}

export interface ArteryPageTemplate {
  type: 'artery';
  key: string;
  name: string;
  artery: Artery;
}

export type PageTemplate = FormPageTemplate | ArteryPageTemplate;

type CreateTemplateParam =
  | {
      type: 'artery';
      arteryID: string;
      name: string;
    }
  | {
      type: 'form';
      name: string;
      appID: string;
      tableID: string;
    };

const PAGE_TEMPLATE_KEY_PREFIX = 'page-template';
const PAGE_TEMPLATE_VERSION = '1.0.0';

function queryPageTemplates(): Promise<PageTemplate[]> {
  return httpClient('/api/v1/persona/dataset/m/search/key', { key: PAGE_TEMPLATE_KEY_PREFIX })
    .then((pageTemplateKeyPairs) => getBatchGlobalConfig(pageTemplateKeyPairs as GetParams[]))
    .then(({ result }) => {
      return Object.entries(result)
        .map<PageTemplate | undefined>(([key, value]) => {
          const pageTemplates = parseJSON<PageTemplate | undefined>(value, undefined);
          if (!pageTemplates) {
            return;
          }

          return { ...pageTemplates, key };
        })
        .filter((n): n is PageTemplate => !!n)
        .sort((miniArteryA, miniArteryB) => {
          const timestampA = miniArteryA.key.split(':')[1];
          const timestampB = miniArteryB.key.split(':')[1];

          return timestampA < timestampB ? 1 : -1;
        });
    });
}

function createTemplateKey(): string {
  return `${PAGE_TEMPLATE_KEY_PREFIX}:${new Date().toISOString()}:${uuid()}`;
}

function addTemplate(template: Partial<PageTemplate>): Promise<void> {
  return setBatchGlobalConfig([
    {
      key: createTemplateKey(),
      version: PAGE_TEMPLATE_VERSION,
      value: JSON.stringify(template),
    },
  ])
    .then(() => undefined)
    .catch(() => {
      toast.error('新建模版失败');
      return;
    });
}

class PageTemplatesStore {
  @observable pageTemplates: PageTemplate[] = [];

  constructor() {
    this.fetchTemplates();
  }

  @action
  fetchTemplates = (): void => {
    queryPageTemplates().then((templates) => (this.pageTemplates = templates));
  };

  createTemplate = async (params: CreateTemplateParam): Promise<void> => {
    let template: Partial<PageTemplate> | undefined;
    const templateName = `模版-${params.name}-${dayjs(new Date()).format('YYYY-MM-DD')}`;
    if (params.type === 'artery') {
      const { result } = await getBatchGlobalConfig([{ key: params.arteryID, version: '1.0.0' }]);
      const artery = parseJSON<Artery | undefined>(result[params.arteryID], undefined);

      template = {
        name: templateName,
        type: 'artery',
        artery,
      };
    }

    if (params.type === 'form') {
      const res = await getTableSchema(params.appID, params.tableID);
      if (!res) {
        toast.error('保存表单模版失败，没有查询到对应的表单 Schema');
        return;
      }
      template = {
        type: 'form',
        name: templateName,
        schema: res.schema,
      };
    }

    if (!template) {
      return;
    }

    return addTemplate(template).then(() => {
      toast.success('新建模板成功！');
      this.fetchTemplates();
    });
  };

  deleteTemplate = (key: string): Promise<void> => {
    return httpClient('/api/v1/persona/dataset/m/bulk/delete', { key }).then(() => this.fetchTemplates());
  };

  renameTemplate = (key: string, newName: string): Promise<void> => {
    const template = this.pageTemplates.find((template) => template.key === key);
    if (!template) {
      return Promise.resolve();
    }

    return setBatchGlobalConfig([
      {
        key: key,
        version: PAGE_TEMPLATE_VERSION,
        value: JSON.stringify({ ...template, name: newName }),
      },
    ])
      .then(() => this.fetchTemplates())
      .catch(() => {
        toast.error('更新模版失败');
        return;
      });
  };
}

export default new PageTemplatesStore();
