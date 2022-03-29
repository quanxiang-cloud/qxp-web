export const DEFAULT_CONFIG = {
  primaryColor: 'blue',
  titleIcon: '/dist/images/quanxiangyun.svg',
  favicons: '/dist/images/favicons/favicon-32x32.png',
  css: '',
};

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
