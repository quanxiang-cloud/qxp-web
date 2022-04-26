import { Package } from './type';

export const defaultPackages: Package[] = [
  {
    name: '@one-for-all/ui',
    label: 'ui(不推荐)',
    version: 'latest',
    categories: ['布局组件', '基础组件', '表单组件'],
  },
  {
    name: 'system-components',
    label: '系统组件',
    version: 'latest',
  },
  {
    name: 'ofa-ui',
    label: 'legacy',
    version: 'latest',
    categories: ['布局组件', '基础组件', '表单组件', '高级组件'],
  },
  {
    name: 'all',
    label: '所有组件',
    version: 'latest',
  },
];

export const GROUP_TITLE_MAP: { [key: string]: string } = {
  comps: '平台组件库',
  templates: '区块模板',
  page_tree: '页面层级',
  data_source: '数据源',
};
