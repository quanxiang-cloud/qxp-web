const schema: ISchema = {
  type: 'object',
  properties: {
    fields: {
      type: 'object',
      'x-component': 'mega-layout',
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
    },
  },
};

export default schema;
