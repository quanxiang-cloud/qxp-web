export default {
  type: 'object',
  properties: {
    apiDoc: {
      type: 'string',
      default: '',
      'x-component': 'PolyDocDetail',
      'x-props': {
        itemStyle: {
          marginBottom: 0,
        },
        itemClassName: 'px-20 py-8 bg-gray-100',
      },
      'x-index': 0,
    },
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
      'x-index': 1,
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
      'x-index': 2,
    },
  },
};
