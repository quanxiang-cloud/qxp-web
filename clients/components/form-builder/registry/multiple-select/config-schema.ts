
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
          default: '下拉框',
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
        // sortable: {
        //   title: '列表排序',
        //   default: false,
        //   'x-component': 'Switch',
        //   'x-index': 5,
        // },
        required: {
          title: '是否必填',
          default: false,
          'x-component': 'Switch',
          'x-index': 6,
        },
        allowCustom: {
          title: '允许自定义',
          default: false,
          'x-component': 'Switch',
          'x-index': 7,
        },
        defaultValueFrom: {
          title: '选项来源',
          enum: [
            {
              label: '自定义',
              value: 'customized',
            },
            {
              label: '选项集',
              value: 'dataset',
            },
            {
              label: 'API',
              value: 'api',
            },
            // {
            //   label: '关联已有数据',
            //   value: 'linkage',
            // },
            // {
            //   label: '通过公式计算',
            //   value: 'formula',
            // },
          ],
          'x-component': 'select',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 8,
          'x-linkages': [
            {
              type: 'value:state',
              target: 'availableOptions',
              state: {
                display: '{{ $value === "customized" }}',
              },
            },
            {
              type: 'value:visible',
              target: 'edit',
              condition: '{{ $value === "customized" }}',
            },
            {
              type: 'value:state',
              target: 'add',
              state: {
                display: '{{ $value === "customized" }}',
              },
            },
            {
              type: 'value:visible',
              target: 'linkageConfig',
              condition: '{{ $value === "linkage" }}',
            },
            {
              type: 'value:visible',
              target: 'datasetId',
              condition: '{{ $value === "dataset" }}',
            },
            {
              type: 'value:visible',
              target: 'defaultValue',
              condition: '{{ $value === "dataset" }}',
            },
            {
              type: 'value:visible',
              target: '*(formApi,sendUserData)',
              condition: '{{ $value === "api" }}',
            },
          ],
        },
        linkageConfig: {
          'x-component': 'DefaultValueLinkageConfigBtn',
          'x-component-props': {
            value: '设置数据联动',
          },
          'x-index': 9,
        },
        availableOptions: {
          'x-component': 'OptionsConfig',
          'x-component-props': {
            mode: 'multiple',
          },
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 10,
        },
        edit: {
          type: 'string',
          'x-component': 'EditLabels',
        },
        datasetId: {
          title: '选项集',
          required: true,
          triggerType: 'onBlur',
          'x-rules': {
            required: true,
            message: '请选择选项集',
          },
          'x-component': 'DatasetConfig',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 12,
        },
        formApi: {
          title: 'API:',
          required: true,
          'x-rules': {
            required: true,
            message: '请选择API',
          },
          'x-component': 'FormApi',
          'x-index': 13,
        },
        sendUserData: {
          title: '允许发送用户信息',
          default: false,
          'x-component': 'Switch',
          'x-index': 14,
        },
        defaultValue: {
          type: 'string',
          title: '默认值',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 15,
        },
      },
    },
  },
};

export default schema;
