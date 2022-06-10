import { Package } from '@pageDesign/blocks/fountainhead/type';

import versionMap from '../name-version-map';

export async function getPackages(): Promise<Package[]> {
  const iconVersion = versionMap['@one-for-all/icon'];
  const res = await fetch(`https://ofapkg.pek3b.qingstor.com/@one-for-all/icon@${iconVersion}/svgNameMap.json`);
  const svgNameMap = await res.json();
  const categories = Object.keys(svgNameMap);

  return [
    {
      name: 'all',
      label: '所有组件',
      version: versionMap.all,
    },
    {
      name: 'system-components',
      label: '系统组件',
      version: versionMap['system-components'],
    },
    // {
    //   name: '@one-for-all/ui',
    //   label: 'UI (不推荐)',
    //   version: versionMap['@one-for-all/ui'],
    //   categories: ['布局组件', '基础组件', '表单组件'],
    // },
    // {
    //   name: 'ofa-ui',
    //   label: 'legacy',
    //   version: versionMap['ofa-ui'],
    //   categories: ['布局组件', '基础组件', '表单组件', '高级组件'],
    //   hide: true,
    // },
    {
      name: '@one-for-all/icon',
      label: '图标库',
      version: versionMap['@one-for-all/icon'],
      categories,
    },
    {
      name: '@one-for-all/headless-ui',
      label: 'headless-ui',
      version: versionMap['@one-for-all/headless-ui'],
      categories: ['基础组件', '表单组件', '高级组件'],
    },
  ];
}
