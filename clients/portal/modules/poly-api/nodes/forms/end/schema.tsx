import { validateNamed } from '@portal/modules/poly-api/utils/object-editor';

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
      'x-rules': [
        (values: POLY_API.PolyEndBody): string => {
          return validateNamed(values.data) ? '参数名称必填' : '';
        },
      ],
      'x-index': 0,
    },
  },
};
