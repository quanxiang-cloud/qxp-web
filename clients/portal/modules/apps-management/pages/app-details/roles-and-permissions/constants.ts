export const INIT_CURRENT_RIGHTS: RoleRight = {
  id: '',
  name: '',
  description: '',
  appID: '',
  type: 2,
};

export const COMPONENT_NAME_TITLE_MAP: Record<string, string> = {
  LayoutTabs: '选项卡',
  LayoutCard: '分组',
  LayoutGrid: '栅格',
};

export const SCOPE = {
  ALL: 0,
  STAFF: 1,
  DEP: 2,
};

export const Role = {
  DEFAULT: 1,
  CUSTOMIZE: 2,
};

// 全部
const ALL_ALLOWED = {};

// 仅自己
const ONLY_SELF = {
  query: {
    $user: 'creator_id',
  },
};

// 自己和下属
const SELF_AND_SUB =
  {
    query: {
      bool: {
        should: [
          { $user: 'creator_id' },
          { $subordinate: 'creator_id' },
        ],
      },
    },
  };

export const DATA_RANGE_OPTIONS = [
  {
    label: '全部数据',
    value: 'ALL',
  },
  {
    label: '仅本人数据',
    value: 'SELF',
  },
  {
    label: '本人及下属的数据',
    value: 'SELF_WITH_SUB',
  },
];

export const DATA_RANGE: Record<string, string> = {
  ALL: JSON.stringify(ALL_ALLOWED, null, 4),
  SELF: JSON.stringify(ONLY_SELF, null, 4),
  SELF_WITH_SUB: JSON.stringify(SELF_AND_SUB, null, 4),
};

export const INIT_INPUT_SCHEMA: SwagFieldSchema = {
  type: 'object',
  properties: {},
};
