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
          default: '关联数据',
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
        placeholder: {
          type: 'string',
          title: '占位提示',
          default: '选择关联数据',
          'x-component': 'Input',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 1,
        },
        description: {
          type: 'string',
          title: '描述内容',
          maxLength: 50,
          'x-component': 'Input',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 2,
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
          ],
          'x-component': 'RadioGroup',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 3,
        },
        required: {
          title: '是否必填',
          default: false,
          'x-component': 'Switch',
          'x-index': 9,
        },
        associationTableID: {
          title: '关联记录表',
          default: false,
          triggerType: 'onBlur',
          enum: [],
          'x-component': 'Select',
          required: true,
          'x-rules': {
            required: true,
            message: '请选择关联表',
          },
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        fieldName: {
          title: '显示字段',
          default: false,
          enum: [],
          'x-component': 'Select',
          triggerType: 'onBlur',
          required: true,
          'x-rules': {
            required: true,
            message: '请选择显示字段',
          },
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
      },
    },
  },
};

export default schema;
