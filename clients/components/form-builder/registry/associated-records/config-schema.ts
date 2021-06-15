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
            // {
            //   label: '隐藏',
            //   value: 'hidden',
            // },
          ],
          'x-component': 'RadioGroup',
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
        // enableFilter: {
        //   title: '限制可选记录范围',
        //   default: false,
        //   'x-component': 'Switch',
        //   'x-index': 5,
        //   'x-linkages': [
        //     {
        //       type: 'value:visible',
        //       target: 'filter',
        //       condition: '{{ $value }}',
        //     },
        //   ],
        // },
        // filter: {
        //   type: 'object',
        //   'x-component': 'FilterConfigBtn',
        //   'x-index': 6,
        // },
        columns: {
          title: '显示字段',
          default: false,
          type: 'array',
          items: { type: 'string' },
          'x-component': 'AssociatedTableColumnsPicker',
          'x-index': 7,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        required: {
          title: '是否必填',
          default: false,
          'x-component': 'Switch',
          'x-index': 8,
        },
      },
    },
  },
};

export default schema;
