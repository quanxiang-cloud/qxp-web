export default {
  type: 'object',
  properties: {
    cond: {
      type: 'object',
      default: {
        type: 'direct_expr',
        data: '',
      },
      'x-component': 'condition',
      'x-props': {
        itemStyle: {
          marginBottom: 0,
        },
        itemClassName: 'bg-gray-100',
      },
      'x-index': 0,
    },
    yes: {
      type: 'string',
      default: '',
      'x-component': 'input',
      display: false,
      'x-index': 1,
    },
    no: {
      type: 'string',
      default: '',
      'x-component': 'input',
      display: false,
      'x-index': 2,
    },
  },
};
