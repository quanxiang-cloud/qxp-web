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
          default: '级联选择',
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
        defaultValueFrom: {
          title: '数值源',
          enum: [
            {
              label: '自定义',
              value: 'customized',
            },
            {
              label: '选项集',
              value: 'predefined-dataset',
            },
            {
              label: 'API',
              value: 'api',
            },
          ],
          'x-component': 'select',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 4,
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'customizedDataset',
              condition: '{{ $value === "customized" }}',
            },
            {
              type: 'value:visible',
              target: 'predefinedDataset',
              condition: '{{ $value === "predefined-dataset" }}',
            },
            {
              type: 'value:visible',
              target: '*(formApi,sendUserData)',
              condition: '{{ $value === "api" }}',
            },
          ],
        },
        customizedDataset: {
          title: '级联选项',
          'x-component': 'CustomizedDatasetBtn',
          'x-index': 5,
        },
        predefinedDataset: {
          title: '级联选项',
          'x-component': 'DatasetSelector',
          'x-index': 6,
        },
        formApi: {
          title: 'API:',
          required: true,
          'x-rules': {
            required: true,
            message: '请选择API',
          },
          'x-component': 'FormApi',
          'x-index': 7,
        },
        sendUserData: {
          title: '允许发送用户信息',
          default: false,
          'x-component': 'Switch',
          'x-index': 8,
        },
        showFullPath: {
          title: '结果显示路径',
          default: false,
          'x-component': 'Switch',
          'x-index': 9,
        },
        // dropdownStyle: {
        //   type: 'string',
        //   title: '下拉菜单样式',
        //   default: 'cascade',
        //   enum: [
        //     {
        //       label: '级联选择',
        //       value: 'cascade',
        //     },
        //     {
        //       label: '树形选择',
        //       value: 'tree',
        //     },
        //   ],
        //   'x-component': 'RadioGroup',
        //   'x-mega-props': {
        //     labelAlign: 'top',
        //   },
        //   'x-index': 8,
        // },
        required: {
          title: '是否必填',
          default: false,
          'x-component': 'Switch',
          'x-index': 10,
        },
      },
    },
  },
};

export default schema;
