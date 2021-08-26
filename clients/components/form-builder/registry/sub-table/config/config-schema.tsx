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
          default: '子表单',
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
          'x-component': 'Textarea',
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
        subordination: {
          title: '子表来源',
          type: 'string',
          default: 'sub_table',
          enum: [
            {
              label: '从空白创建',
              value: 'sub_table',
            },
            {
              label: '选择已有表作为子表',
              value: 'foreign_table',
            },
          ],
          'x-component': 'Subordination',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 3,
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'linkedTable',
              condition: '{{ $value === "foreign_table" }}',
            },
            {
              type: 'value:visible',
              target: 'subTableColumns',
              condition: '{{ $value === "foreign_table" }}',
            },
            {
              type: 'value:visible',
              target: 'subTableSchema',
              condition: '{{ $value === "sub_table" }}',
            },
          ],
        },
        linkedTable: {
          type: 'object',
          default: {
            appID: '',
            tableID: '',
            tableName: '',
          },
          'x-component': 'LinkedTable',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 4,
        },
        subTableSchema: {
          type: 'object',
          'x-component': 'SubTableSchema',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 5,
        },
        subTableColumns: {
          type: 'array',
          default: [],
          'x-component': 'SubTableColumns',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 6,
        },
        curConfigSubTableKey: {
          type: 'string',
          default: '',
          'x-component': 'Input',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 7,
          visible: false,
        },
        required: {
          title: '是否必填',
          default: false,
          'x-component': 'Switch',
          'x-index': 8,
        },
        tableID: {
          type: 'string',
          'x-component': 'Input',
          'x-component-props': {
            className: 'hidden',
          },
          default: '',
          'x-index': 9,
        },
      },
    },
  },
};

export default schema;
