export default {
  type: 'object',
  properties: {
    inputs: {
      type: 'array',
      default: [],
      'x-component': 'BodyEditor',
      'x-props': {
        itemStyle: {
          marginBottom: 0,
        },
        itemClassName: 'px-20',
      },
      'x-index': 0,
    },
    constants: {
      type: 'array',
      default: [],
      'x-component': 'ConstantsEditor',
      'x-props': {
        itemStyle: {
          marginBottom: 0,
        },
        itemClassName: 'px-20',
      },
      'x-index': 1,
    },
  },
};
