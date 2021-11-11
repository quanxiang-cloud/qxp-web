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
        uploaderDescription: {
          title: '附件内描述',
          default: '',
          'x-mega-props': {
            labelAlign: 'top',
          },
          maxLength: 30,
          'x-component': 'Input',
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

        required: {
          title: '是否必填',
          default: false,
          'x-component': 'Switch',
          'x-index': 4,
        },
        multiple: {
          title: '允许上传多个附件',
          default: false,
          'x-component': 'Switch',
          'x-index': 4,
        },
        maxFileSize: {
          title: '附件最大体积(MB)',
          required: true,
          maxLength: 4,
          'x-component': 'NumberPicker',
          'x-index': 6,
          'x-rules': {
            required: true,
            message: '请输入附件最大体积',
          },
          'x-component-props': {
            min: 10,
            max: 5000,
            precision: 0,
          },
        },
      },
    },
  },
};

export default schema;
