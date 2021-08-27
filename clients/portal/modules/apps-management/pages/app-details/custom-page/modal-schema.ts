const schema: ISchema = {
  type: 'object',
  properties: {
    Fields: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 4,
        labelAlign: 'right',
      },
      properties: {
        name: {
          title: '页面名称',
          required: true,
          type: 'string',
          'x-component': 'Input',
          maxLength: 20,
        },
        type: {
          title: '类型',
          'x-component': 'RadioGroup',
          default: '1',
          enum: [
            { label: 'HTML自定义页面', value: 1 },
          ],
        },
        description: {
          title: '页面描述',
          'x-component': 'TextArea',
          maxLength: 200,
        },
        fileUrl: {
          title: 'HTML文件',
          'x-component': 'FileUpload',
        },
      },
    },
  },
};

export default schema;
