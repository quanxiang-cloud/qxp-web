const workTitles = [
  {
    label: '高级职工',
    value: '高级职工',
    children: [
      {
        label: '高级产品经理',
        value: '高级产品经理',
      },
      {
        label: '高级项目经理',
        value: '高级项目经理',
      },
      {
        label: '高级前端工程师',
        value: '高级前端工程师',
      },
      {
        label: '高级后端工程师',
        value: '高级后端工程师',
      },
      {
        label: '高级测试工程师',
        value: '高级测试工程师',
      },
    ],
  },
  {
    label: '中级职工',
    value: '中级职工',
    children: [
      {
        label: '中级产品经理',
        value: '中级产品经理',
      },
      {
        label: '中级项目经理',
        value: '中级项目经理',
      },
      {
        label: '中级前端工程师',
        value: '中级前端工程师',
      },
      {
        label: '中级后端工程师',
        value: '中级后端工程师',
      },
      {
        label: '中级测试工程师',
        value: '中级测试工程师',
      },
    ],
  },
  {
    label: '初级职工',
    value: '初级职工',
    children: [
      {
        label: '初级产品经理',
        value: '初级产品经理',
      },
      {
        label: '初级项目经理',
        value: '初级项目经理',
      },
      {
        label: '初级前端工程师',
        value: '初级前端工程师',
      },
      {
        label: '初级后端工程师',
        value: '初级后端工程师',
      },
      {
        label: '初级测试工程师',
        value: '初级测试工程师',
      },
    ],
  },
];

const region = [
  {
    label: '华北',
    value: '华北',
    children: [
      {
        label: '北京',
        value: '北京',
      },
      {
        label: '天津',
        value: '天津',
      },
      {
        label: '济南',
        value: '济南',
      },
    ],
  },
  {
    label: '西南',
    value: '西南',
    children: [
      {
        label: '成都',
        value: '成都',
      },
      {
        label: '云南',
        value: '云南',
      },
    ],
  },
];

export const datasetRecord: Record<string, any[]> = {
  workTitles: workTitles,
  region: region,
};

export default [
  { label: '职称', value: 'workTitles', options: workTitles },
  { label: '地区', value: 'region', options: region },
];
