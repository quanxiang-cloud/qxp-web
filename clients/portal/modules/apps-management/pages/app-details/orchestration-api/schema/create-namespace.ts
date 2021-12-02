const createNamespaceSchema: ISchema = {
  type: 'object',
  properties: {
    Fields: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelAlign: 'top',
        full: true,
      },
      'x-props': {
        className: 'mb-0 orchestration-modal-form',
      },
      properties: {
        title: {
          title: '分组名称',
          type: 'string',
          'x-component': 'InputWithDesc',
          'x-component-props': {
            placeholder: '请输入，例如：公司系统',
            desc: '不超过 20 个字符，分组名称不可重复',
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
          'x-component': 'InputWithDesc',
          'x-component-props': {
            placeholder: '请输入，例如：sys_001',
            desc: '不超过 20 字符，必须以字母开头，只能包含字母、数字、下划线，标识不可重复。',
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
            placeholder: '选填 (不超过 100 字符)',
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
