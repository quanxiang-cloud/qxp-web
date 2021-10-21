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
          default: 'normal',
          enum: [
            {
              label: '普通',
              value: 'normal',
            },
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
          'x-linkages': [{
            type: 'value:visible',
            target: 'defaultValueLinkage',
            condition: '{{ $value === "readonly" }}',
          }],
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 2,
        },
        linkedTable: {
          title: '关联记录表',
          type: 'object',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-rules': {
            required: true,
            message: '请选择关联表',
          },
          'x-component': 'LinkedTable',
          'x-index': 3,
        },
        multiple: {
          title: '关联记录数量',
          default: false,
          enum: [
            {
              label: '单条',
              value: false,
            },
            {
              label: '多条',
              value: true,
            },
          ],
          'x-component': 'RadioGroup',
          'x-index': 4,
        },
        columns: {
          title: '显示字段',
          default: false,
          type: 'array',
          items: { type: 'string' },
          'x-component': 'AssociatedTableColumnsPicker',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 5,
        },
        required: {
          title: '是否必填',
          default: false,
          'x-component': 'Switch',
          'x-index': 6,
        },
        defaultValueLinkage: {
          title: '数据源',
          'x-component': 'DefaultValueLinkageConfigBtn',
          'x-component-props': {
            isLinkedFieldHide: true,
            isLinkedTableReadonly: true,
          },
          'x-index': 7,
        },
        filterConfig: {
          title: '',
          'x-component': 'FilterConfig',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 8,
        },
      },
    },
  },
};

export default schema;
