import { Package } from './type';
import pkg from '../../../../../../../../package.json';

export const defaultPackages: Package[] = [
  {
    name: 'internal',
    label: '内置',
    url: 'internal',
    version: pkg.version,
    categories: ['布局组件', '基础组件', '表单组件', '高级组件'],
  },
  {
    name: 'system',
    label: '系统',
    url: 'system',
    version: pkg.version,
  },
  {
    name: 'all',
    label: '所有组件',
    url: 'all',
    version: pkg.version,
  },
];

export const GROUP_TITLE_MAP: { [key: string]: string } = {
  comps: '平台组件库',
  templates: '区块模板',
  page_tree: '页面层级',
  data_source: '数据源',
};
