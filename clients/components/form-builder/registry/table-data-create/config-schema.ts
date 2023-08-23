const schema: ISchema = {
  type: 'object',
  properties: {
    Fields: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        title: {
          type: 'string',
          title: '标题名称',
          default: '关联记录',
          required: true,
          maxLength: 50,
          'x-rules': {
            required: true,
            message: '请输入标题名称',
          },
          'x-component': 'Input',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 0,
        },
        description: {
          type: 'string',
          title: '描述内容',
          maxLength: 50,
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入',
          },
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 1,
        },
        displayModifier: {
          type: 'string',
          title: '字段属性',
          default: 'readonly',
          enum: [
            {
              label: '只读',
              value: 'readonly',
            },
            {
              label: '隐藏',
              value: 'hidden',
            },
          ],
          'x-component': 'RadioGroup',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 2,
        },
        linkedTable: {
          title: '请选择目标表',
          type: 'object',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-rules': {
            required: true,
            message: '请选择数据新增目标表',
          },
          'x-component': 'LinkedTable',
          'x-index': 3,
        },
        createRules: {
          title: '新增规则',
          type: 'object',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-rules': {
            required: false,
            message: '请设置数据新增规则',
          },
          'x-component': 'CreateRules',
          'x-index': 4,
        },
        defaultValue: {
          type: 'string',
          title: '默认值',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入默认值',
          },
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 10,
        },
      },
    },
  },
};

export default schema;
