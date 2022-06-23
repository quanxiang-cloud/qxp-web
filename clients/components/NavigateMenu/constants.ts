import { MenuItemType } from './menu-item';

export const menus: Array<MenuItemType> = [
  {
    id: 'view_setting',
    title: '视图管理aediouweosfuiowesaolfdjsl;dgfjldkjgksjdflk',
    children: [
      {
        id: 'page_setting',
        title: '页面管理',
      },
      {
        id: 'nav_setting',
        title: '导航管理',
      },
    ],
  },
  {
    id: 'modal_api',
    title: '数据管理',
    children: [
      {
        id: 'data_models',
        title: '数据模型管理',
      },
      {
        id: 'api_proxy',
        title: '第三方 API 代理',
      },
      {
        id: 'orchestration_api',
        title: 'API 编排管理',
      },
      {
        id: 'faas',
        title: 'FaaS 函数管理',
      },
      {
        id: 'key_api',
        title: 'API 密钥管理',
      },
      {
        id: 'file_api',
        title: 'API 文档',
      },
    ],
  },
  {
    id: 'setting_flow',
    title: '工作流',
  },
  {
    id: 'app_control',
    title: '访问控制',
  },
  {
    id: 'base_info',
    title: '应用设置',
  },
];
