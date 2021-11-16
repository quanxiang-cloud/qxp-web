export default {
  type: 'object',
  'x-component-props': {
    style: {
      height: '100%',
    },
  },
  properties: {
    cond: {
      type: 'object',
      default: {
        type: 'direct_expr',
        data: '',
      },
      'x-component': 'Condition',
      'x-props': {
        itemStyle: {
          marginBottom: 0,
        },
        itemClassName: 'bg-gray-100 h-full',
      },
      'x-index': 0,
    },
    yes: {
      type: 'string',
      default: '',
      'x-component': 'Input',
      display: false,
      'x-index': 1,
    },
    no: {
      type: 'string',
      default: '',
      'x-component': 'Input',
      display: false,
      'x-index': 2,
    },
  },
};
