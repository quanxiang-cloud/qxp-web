import { LayoutType } from './types.d';

export const ROOT_NODE_ID = 'root_node';
export const LAYOUT_CHILD_TYPE_ROUTES_CONTAINER = 'routes-container';
export const LAYOUT_CHILD_TYPE_FRAGMENT_CONTAINER = 'fragment-container';
export const DefaultFormDescriptions = [
  { id: 'type', title: '页面类型', value: '表单' },
  { id: 'fieldLen', title: '已配置字段总数', value: '' },
  { id: 'createdBy', title: '创建人', value: '' },
  { id: 'createdAt', title: '创建时间', value: '' },
  { id: 'updatedBy', title: '修改人', value: '' },
  { id: 'updatedAt', title: '修改时间', value: '' },
];

export const URL_PARAM_LIST = [
  '${user_id}',
  '${user_name}',
  '${user_email}',
  '${user_phone}',
  '${dep_id}',
  '${dep_name}',
  '${appid}',
];

export const VIEW_TYPE_MAP: Record<LayoutType, string> = {
  [LayoutType.HeaderContent]: '顶部',
  [LayoutType.LeftSidebarContent]: '左侧',
  [LayoutType.RightSidebarContent]: '右侧',
};
