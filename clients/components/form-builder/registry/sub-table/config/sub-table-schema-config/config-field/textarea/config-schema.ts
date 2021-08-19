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
              value: 'telephone',
            },
            {
              label: '邮编号码',
              value: 'post_code',
            },
            {
              label: '手机号码',
              value: 'phone',
            },
            {
              label: '身份证号',
              value: 'idcard',
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
          'x-index': 3,
        },
        displayModifier: {
          type: 'string',
          title: '字段属性',
          default: 'normal',
          'x-component': 'Input',
          'x-mega-props': {
            labelAlign: 'top',
          },
          visible: false,
          'x-index': 4,
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
          'x-index': 5,
        },
        required: {
          title: '是否必填',
          default: false,
          'x-component': 'Switch',
          'x-index': 6,
        },
      },
    },
  },
};

export default schema;
