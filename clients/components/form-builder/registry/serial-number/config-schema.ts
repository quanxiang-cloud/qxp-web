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
          'x-index': 3,
        },
        prefix: {
          type: 'string',
          title: '前缀',
          'x-component': 'Prefix',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 4,
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
            max: 10,
            precision: 0,
          },
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 5,
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
            max: 9999999999,
            precision: 0,
          },
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 6,
        },
        suffix: {
          type: 'string',
          title: '后缀',
          default: '',
          maxLength: 50,
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入后缀',
          },
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 7,
        },
      },
    },
  },
};

export default schema;
