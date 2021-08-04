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
          default: '请输入',
          required: true,
          maxLength: 50,
          'x-rules': {
            required: true,
            message: '请输入描述内容',
          },
          'x-component': 'Input',
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
          default: 'ER',
          maxLength: 50,
          'x-component': 'PrefixSuffix',
          'x-component-props': {
            type: 'prefix',
          },
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
          'x-rules': {
            required: true,
            message: '请输入编号初始位数',
          },
          'x-component': 'Input',
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
          'x-rules': {
            required: true,
            message: '请输入编号起始值',
          },
          'x-component': 'Input',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 5,
        },
        suffix: {
          type: 'string',
          title: '后缀',
          maxLength: 50,
          'x-component': 'PrefixSuffix',
          'x-component-props': {
            type: 'suffix',
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
