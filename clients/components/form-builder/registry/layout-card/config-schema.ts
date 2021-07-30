const schema: ISchema = {
  type: 'object',
  properties: {
    Fields: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        title: {
          type: 'string',
          title: '标题',
          default: '分组',
          'x-component': 'Input',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 0,
        },
        collapsible: {
          title: '可折叠',
          default: false,
          'x-component': 'Switch',
          'x-index': 1,
        },
      },
    },
  },
};

export default schema;
