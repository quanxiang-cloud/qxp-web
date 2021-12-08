
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
        itemClassName: 'px-20 input-editor-error-tips-hidden',
      },
      'x-rules': [
        (values: POLY_API.PolyNodeInput[]): string => {
          return values.some(({ name, type, data }) => {
            if (type === 'object') {
              console.log(data);
              return true;
            }

            return !name;
          }) ? '参数名称必填' : '';
        },
      ],
      'x-index': 1,
    },
    consts: {
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
