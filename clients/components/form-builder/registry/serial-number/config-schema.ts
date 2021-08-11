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
          default: '流水号',
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
          default: '',
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
        numberPreview: {
          type: 'string',
          title: '编号预览',
          maxLength: 50,
          readOnly: true,
          'x-component': 'Input',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 2,
        },
        prefix: {
          type: 'string',
          title: '前缀',
          'x-component': 'Prefix',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 3,
        },
        initialPosition: {
          type: 'number',
          title: '编号初始位数',
          default: 5,
          required: true,
          maxLength: 50,
          'x-component': 'NumberPicker',
          'x-component-props': {
            min: 2,
            max: 9999999,
            precision: 0,
          },
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 4,
        },
        initialValue: {
          type: 'number',
          title: '编号起始值',
          default: 1,
          required: true,
          maxLength: 50,
          'x-component': 'NumberPicker',
          'x-component-props': {
            min: 1,
            max: 9999999,
            precision: 0,
          },
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 5,
        },
        suffix: {
          type: 'string',
          title: '后缀',
          default: 'yyyyMMdd',
          enum: [
            {
              label: '年',
              value: 'yyyy',
            },
            {
              label: '年月',
              value: 'yyyyMM',
            },
            {
              label: '年月日',
              value: 'yyyyMMdd',
            },
            {
              label: '年月日时分',
              value: 'yyyyMMddHHmm',
            },
            {
              label: '年月日时分秒',
              value: 'yyyyMMddHHmmss',
            },
          ],
          'x-component': 'select',
          'x-component-props': {
            placeholder: 'select',
          },
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 6,
        },
      },
    },
  },
};

export default schema;
