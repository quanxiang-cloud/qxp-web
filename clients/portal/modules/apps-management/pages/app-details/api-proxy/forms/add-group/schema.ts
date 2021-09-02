export const basicSchema: ISchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '分组名称',
      required: true,
      'x-rules': {
        required: true,
        message: '请输入分组名称',
      },
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入',
      },
    },
    remark: {
      type: 'string',
      title: '分组标识',
      required: true,
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入英文+数字',
      },
      description: '该标识用于确认唯一路径，创建后不可修改。例如：QingCloud',
    },
    pid: {
      type: 'string',
      title: '上级分组',
      'x-component': 'Select',
      enum: [],
    },
    description: {
      type: 'string',
      title: '描述',
      'x-component': 'TextArea',
      maxLength: 200,
    },
  },
};

export const othersSchema:ISchema = {
  type: 'object',
  properties: {
    protocol: {
      type: 'string',
      title: '协议',
      required: true,
      'x-component': 'RadioGroup',
      default: 'http',
      enum: [
        { label: 'HTTP', value: 'http' },
        { label: 'HTTPS', value: 'https' },
      ],
    },
    host: {
      type: 'string',
      title: '主机地址(域名)',
      required: true,
      'x-component': 'Input',
    },
  },
};
