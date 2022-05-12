const res = await fetch('https://ofapkg.pek3b.qingstor.com/@one-for-all/icon@0.6.1/svgNameMap.json');
const svgNameMap = await res.json();
const categories = Object.keys(svgNameMap);

export default [
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
  {
    name: '@one-for-all/icon',
    label: '图标库',
    version: '0.6.2',
    categories,
  },
];
