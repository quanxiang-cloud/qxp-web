export default {
  type: 'object',
  'x-component-props': {
    style: {
      height: '100%',
    },
  },
  properties: {
    body: {
      type: 'object',
      default: {
        type: 'object',
        data: [],
      },
      'x-component': 'EndBody',
      'x-props': {
        itemStyle: {
          marginBottom: 0,
        },
        itemClassName: 'bg-gray-100 h-full',
      },
      'x-index': 0,
    },
  },
};
