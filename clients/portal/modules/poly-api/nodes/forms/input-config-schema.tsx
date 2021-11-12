export default {
  type: 'object',
  properties: {
    inputs: {
      type: 'array',
      'x-component': 'ObjectEditor',
      'x-props': {
        itemStyle: {
          marginBottom: '8px',
        },
      },
      'x-index': 0,
    },
    constants: {
      type: 'array',
      'x-component': 'Input',
      'x-component-props': {
        // nested: false,
      },
      'x-props': {
        itemStyle: {
          marginBottom: '8px',
        },
      },
      'x-index': 1,
    },
  },
};
