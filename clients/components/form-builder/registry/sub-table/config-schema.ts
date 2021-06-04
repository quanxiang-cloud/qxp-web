import { ISchema } from '@formily/react-schema-renderer';

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
        display: {
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
          ],
          'x-component': 'Switcher',
          'x-mega-props': {
            labelAlign: 'top',
          },
          visible: false,
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
          ],
        },
        linkedTable: {
          type: 'object',
          default: {
            appID: '',
            tableID: '',
            tableName: '',
          },
          'x-component': 'FormTableSelectorWrapper',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 4,
        },
        items: {
          type: 'object',
          'x-component': 'FormTableFields',
          'x-mega-props': {
            labelAlign: 'top',
          },
          visible: true,
          'x-index': 5,
        },
        curConfigSubTableKey: {
          type: 'string',
          default: '',
          'x-component': 'Input',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 6,
          visible: false,
        },
        workTableSchemaOptions: {
          type: 'array',
          default: [],
          enum: [],
          'x-component': 'Select',
          'x-mega-props': {
            labelAlign: 'top',
          },
          visible: false,
          'x-index': 7,
        },
        columns: {
          type: 'array',
          default: [],
          'x-component': 'Columns',
          'x-mega-props': {
            labelAlign: 'top',
          },
          visible: true,
          'x-index': 8,
        },
      },
    },
  },
};

export default schema;
