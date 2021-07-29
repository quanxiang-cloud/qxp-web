import { ISchema } from '@formily/react-schema-renderer';

const schema: ISchema = {
  type: 'object',
  properties: {
    Fields: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        title: {
          type: 'string',
          title: '标题名称',
          default: '统计',
          required: true,
          maxLength: 50,
          'x-rules': {
            required: true,
            message: '请输入标题名称',
          },
          'x-component': 'Input',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 0,
        },
        description: {
          type: 'string',
          title: '描述内容',
          maxLength: 50,
          'x-rules': {
            required: true,
            message: '请输入描述内容',
          },
          'x-component': 'Input',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 1,
        },
        displayModifier: {
          type: 'string',
          title: '字段属性',
          default: 'readonly',
          enum: [
            {
              label: '只读',
              value: 'readonly',
            },
            {
              label: '隐藏',
              value: 'hidden',
            },
          ],
          'x-rules': {
            required: true,
            message: '请选择字段属性',
          },
          'x-component': 'RadioGroup',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 2,
        },
        // associatedObjects: {
        //   type: 'string',
        //   title: '关联对象',
        //   default: '',
        //   enum: [
        //     {
        //       label: 'COUNT(计数)',
        //       value: 'count',
        //     },
        //     {
        //       label: 'SUM(求总和)',
        //       value: 'sum',
        //     },
        //     {
        //       label: 'MAX(最大值)',
        //       value: 'max',
        //     },
        //     {
        //       label: 'MIN(最小值)',
        //       value: 'min',
        //     },
        //     {
        //       label: 'AVG(平均值)',
        //       value: 'avg',
        //     },
        //   ],
        //   'x-rules': {
        //     required: true,
        //     message: '请选择关联对象',
        //   },
        //   'x-component': 'select',
        //   'x-mega-props': {
        //     labelAlign: 'top',
        //   },
        //   'x-index': 3,
        // },
        linkedTable: {
          title: '关联对象',
          type: 'object',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-rules': {
            required: true,
            message: '请选择关联对象',
          },
          'x-component': 'LinkedTable',
          'x-index': 3,
        },
        aggType: {
          type: 'string',
          title: '统计类型',
          default: '',
          enum: [
            {
              label: 'COUNT(计数)',
              value: 'count',
            },
            {
              label: 'SUM(求总和)',
              value: 'sum',
            },
            {
              label: 'MAX(最大值)',
              value: 'max',
            },
            {
              label: 'MIN(最小值)',
              value: 'min',
            },
            {
              label: 'AVG(平均值)',
              value: 'avg',
            },
          ],
          'x-rules': {
            required: true,
            message: '请选择统计类型',
          },
          'x-component': 'select',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 4,
        },
        decimalPlaces: {
          type: 'number',
          title: '小数点',
          default: 2,
          required: true,
          maximum: 8,
          minimum: 0,
          'x-rules': {
            required: true,
            message: '请输入保留的小数点位数',
          },
          'x-component': 'Input',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 5,
        },
        roundDecimal: {
          type: 'string',
          title: '小数点',
          default: 'rounding',
          enum: [
            {
              label: '四舍五入',
              value: 'rounding',
            },
            {
              label: '向上取整',
              value: 'round-up',
            },
            {
              label: '向下取整',
              value: 'round-down',
            },
          ],
          'x-rules': {
            required: true,
            message: '请选择取整方式',
          },
          'x-component': 'RadioGroup',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 6,
        },
        displayFieldNull: {
          type: 'string',
          title: '字段计算为空值时显示',
          default: '',
          enum: [
            {
              label: '显示为0',
              value: '0',
            },
            {
              label: '显示为 —',
              value: 'null',
            },
          ],
          'x-rules': {
            required: true,
            message: '请选择字段计算为空值时的显示',
          },
          'x-component': 'select',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 7,
        },
        dataRange: {
          type: 'string',
          title: '统计数据范围',
          default: 'all',
          enum: [
            {
              label: '全部',
              value: 'all',
            },
            {
              label: '设置统计数据范围',
              value: 'part',
            },
          ],
          'x-rules': {
            required: true,
            message: '请选择统计数据范围',
          },
          'x-component': 'RadioGroup',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 8,
        },
      },
    },
  },
};

export default schema;
