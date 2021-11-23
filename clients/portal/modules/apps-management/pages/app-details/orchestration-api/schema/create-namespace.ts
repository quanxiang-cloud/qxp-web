const createNamespaceSchema: ISchema = {
  type: 'object',
  properties: {
    Fields: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'right',
        full: true,
        labelCol: 4,
        wrapperCol: 20,
      },
      properties: {
        title: {
          title: '分组名称',
          type: 'string',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入',
          },
          'x-rules': [
            {
              required: true,
              message: '请输入分组名称',
            },
            {
              max: 20,
            },
            (v: string): boolean | string => /\s+/.test(v) ? '分组名称不能包含空格' : true,
          ],
          'x-index': 0,
        },
        name: {
          title: '分组标识',
          type: 'string',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入英文/数字/下划线',
          },
          'x-rules': [{
            required: true,
            message: '请输入分组标识',
          }, {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '只能包含数字字母下划线, 且以字母或下划线开头',
          }, {
            max: 20,
          }],
          'x-index': 1,
        },
        desc: {
          title: '分组描述',
          type: 'string',
          default: '',
          'x-component': 'TextArea',
          'x-component-props': {
            placeholder: '请输入',
          },
          'x-rules': [{
            max: 100,
          }],
          'x-index': 2,
        },
      },
    },
  },
};

export default createNamespaceSchema;
