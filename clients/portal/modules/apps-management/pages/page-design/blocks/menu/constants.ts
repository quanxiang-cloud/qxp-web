import { Package } from './type';

export const defaultPackages: Package[] = [
  {
    name: 'all',
    label: '所有组件',
    version: '1.0.0',
  },
  {
    name: 'system-components',
    label: '系统组件',
    version: '1.0.0',
  },
  {
    name: '@one-for-all/ui',
    label: 'UI (不推荐)',
    version: '0.3.3',
    categories: ['布局组件', '基础组件', '表单组件'],
  },
  {
    name: 'ofa-ui',
    label: 'legacy',
    version: '1.0.0',
    categories: ['布局组件', '基础组件', '表单组件', '高级组件'],
    hide: true,
  },
];

export const GROUP_TITLE_MAP: { [key: string]: string } = {
  comps: '平台组件库',
  templates: '区块模板',
  page_tree: '页面层级',
  data_source: '数据源',
};
