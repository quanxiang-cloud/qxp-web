const schema: ISchema = {
  type: 'object',
  properties: {
    Fields: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        columns: {
          type: 'string',
          title: '栅格',
          default: 2,
          enum: [
            {
              label: '一栏两列',
              value: 2,
            },
            {
              label: '一栏三列',
              value: 3,
            },
            {
              label: '一栏四列',
              value: 4,
            },
          ],
          'x-component': 'RadioGroup',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 3,
        },
      },
    },
  },
};

export default schema;
