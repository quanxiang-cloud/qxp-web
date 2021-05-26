export const mockNames = [
  {
    id: 'ds-001',
    name: '中国大陆',
    tag: 'tag-1',
  },
  {
    id: 'ds-002',
    name: '服务站点',
    tag: 'tag-2',
  },
];

export const mockDatasets = [
  {
    id: 'ds-001',
    name: '中国大陆',
    content: [
      {
        label: '湖北省',
        value: 'hubei',
        children: [
          { label: '武汉', value: 'wuhan' },
          { label: '鄂州', value: 'ezhou' },
          { label: '黄冈', value: 'huanggang' },
        ],
      },
    ],
  },
  {
    id: 'ds-002',
    name: '服务站点',
    content: [
      {
        label: '谷歌',
        value: 'google',
        children: [
          { label: 'youtube', value: 'youtube' },
          { label: 'deepmind', value: 'deepmind' },
          { label: 'chrome', value: 'chrome' },
        ],
      },
    ],
  },
];
