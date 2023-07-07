export const SCHEMA: ISchema = {
  type: 'object',
  properties: {
    Fields: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        rules: {
          type: 'array',
          'x-component': 'RulesList',
          'x-component-props': {
            btnText: '新增关联赋值规则',
          },
          default: [],
          items: {
            type: 'object',
            properties: {
              dataSource: {
                type: 'string',
                'x-component': 'Select',
              },
              match: {
                type: 'string',
                required: true,
                'x-component': 'Input',
                readOnly: true,
                default: '数据关联',
              },
              dataTarget: {
                type: 'string',
                'x-component': 'Select',
              },
            },
          },
        },
      },
    },
  },
};
