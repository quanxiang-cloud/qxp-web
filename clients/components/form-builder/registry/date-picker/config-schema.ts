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
          default: '时间日期',
          required: true,
          // https://github.com/alibaba/formily/issues/1053
          // this bug has not been fix in current release
          // description: '标题名称',
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
          default: '请输入',
          maxLength: 50,
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
        valueFormat: {
          type: 'string',
          title: '时间格式',
          default: 'YYYY-MM-DD',
          enum: [
            {
              label: '年',
              value: 'YYYY',
            },
            {
              label: '年-月',
              value: 'YYYY-MM',
            },
            {
              label: '年-月-日',
              value: 'YYYY-MM-DD',
            },
            {
              label: '年-月-日 时-分',
              value: 'YYYY-MM-DD HH:mm',
            },
            {
              label: '年-月-日 时-分-秒',
              value: 'YYYY-MM-DD HH:mm:ss',
            },
          ],
          'x-component': 'select',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 4,
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
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 5,
        },
        sortable: {
          title: '列表排序',
          default: false,
          'x-component': 'Switch',
          'x-index': 6,
        },
        required: {
          title: '是否必填',
          default: false,
          'x-component': 'Switch',
          'x-index': 7,
        },
        valueSource: {
          title: '数值源',
          enum: [
            {
              label: '自定义',
              value: 'customized',
            },
            {
              label: '关联已有数据',
              value: 'linkage',
            },
            {
              label: '通过公式计算',
              value: 'formula',
            },
            {
              label: '填写当时',
              value: 'now',
            },
          ],
          'x-component': 'select',
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
