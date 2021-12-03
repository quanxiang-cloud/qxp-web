export const COLORS = [
  'rose',
  'pink',
  'fuchsia',
  'purple',
  'violet',
  'indigo',
  'blue',
  'lightBlue',
  'cyan',
  'teal',
  'emerald',
  'green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'red',
  'warmGray',
  'trueGray',
  'gray',
  'coolGray',
  'blueGray',
];

export const COLOR_DEPTH = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

export const SCHEMA: ISchema = {
  type: 'object',
  properties: {
    Fields: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        primaryColor: {
          type: 'string',
          title: '主色',
          required: true,
          'x-component': 'ColorSelect',
          'x-index': 0,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        titleIcon: {
          type: 'string',
          title: '租户图标',
          'x-component': 'ImgUpload',
          'x-component-props': {},
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        favicons: {
          type: 'string',
          title: '小图标',
          'x-index': 2,
          'x-component': 'ImgUpload',
          'x-component-props': {},
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
      },
    },
  },
};
