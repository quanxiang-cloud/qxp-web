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
          default: '单行文本',
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
          title: '格式',
          default: '',
          enum: [
            {
              label: '无',
              value: '',
            },
            {
              label: '固定电话',
              value: 'phone',
            },
            {
              label: '邮编号码',
              value: 'post_code',
            },
            {
              label: '手机号码',
              value: 'mobile_phone',
            },
            {
              label: '身份证号',
              value: 'id_number',
            },
            {
              label: '邮箱',
              value: 'email',
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
        defaultValueFrom: {
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
          ],
          'x-component': 'select',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 8,
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'defaultValue',
              condition: '{{ $value === "customized" }}',
            },
            {
              type: 'value:visible',
              target: 'defaultValueLinkage',
              condition: '{{ $value === "linkage" }}',
            },
          ],
        },
        defaultValueLinkage: {
          'x-component': 'DefaultValueLinkageConfigBtn',
          'x-index': 9,
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
