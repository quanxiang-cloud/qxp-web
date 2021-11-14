export default {
  type: 'object',
  properties: {
    inputs: {
      type: 'array',
      'x-component': 'BodyEditor',
      'x-props': {
        itemStyle: {
          marginBottom: '8px',
        },
      },
      'x-index': 0,
    },
    constants: {
      type: 'array',
      'x-component': 'ConstantsEditor',
      'x-props': {
        itemStyle: {
          marginBottom: '8px',
        },
      },
      'x-index': 1,
    },
  },
};
