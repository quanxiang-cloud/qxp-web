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
          default: '数字',
          required: true,
          // https://github.com/alibaba/formily/issues/1053
          // this bug has not been fix in current release
          // description: '标题名称',
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
        placeholder: {
          type: 'string',
          title: '占位提示',
          default: '请输入',
          'x-component': 'Input',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 1,
        },
        description: {
          type: 'string',
          title: '描述内容',
          maxLength: 50,
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入',
          },
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 2,
        },
        precision: {
          type: 'string',
          title: '小数点位数',
          default: '',
          'x-component': 'NumberPicker',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 4,
        },
        displayModifier: {
          type: 'string',
          title: '字段属性',
          default: 'normal',
          enum: [
            {
              label: '普通',
              value: 'normal',
            },
            {
              label: '只读',
              value: 'readonly',
            },
            {
              label: '隐藏',
              value: 'hidden',
            },
          ],
          'x-component': 'RadioGroup',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 5,
        },
        // sortable: {
        //   title: '列表排序',
        //   default: false,
        //   'x-component': 'Switch',
        //   'x-index': 6,
        // },
        required: {
          title: '是否必填',
          default: false,
          'x-component': 'Switch',
          'x-index': 7,
        },
        defaultValueFrom: {
          title: '数值源',
          enum: [
            {
              label: '自定义',
              value: 'customized',
            },
            {
              label: '关联已有数据',
              value: 'linkage',
            },
            {
              label: '通过公式计算',
              value: 'formula',
            },
          ],
          'x-component': 'select',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 8,
          'x-linkages': [
            {
              type: 'value:visible',
              target: 'defaultValueLinkage',
              condition: '{{ $value === "linkage" }}',
            },
            {
              type: 'value:visible',
              target: 'min',
              condition: '{{ $value === "customized" }}',
            },
            {
              type: 'value:visible',
              target: 'max',
              condition: '{{ $value === "customized" }}',
            },
            {
              type: 'value:visible',
              target: 'defaultValue',
              condition: '{{ $value === "customized" }}',
            },
            {
              type: 'value:visible',
              target: 'calculationFormula',
              condition: '{{ $value === "formula" }}',
            },
          ],
        },
        defaultValueLinkage: {
          'x-component': 'DefaultValueLinkageConfigBtn',
          'x-index': 9,
        },
        defaultValue: {
          type: 'string',
          title: '默认值',
          'x-component': 'NumberPicker',
          'x-index': 10,
        },
        min: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-index': 11,
          'x-component-props': {
            grid: true,
            columns: 2,
          },
          properties: {
            minSet: {
              type: 'object',
              'x-component': 'CheckboxGroup',
              enum: [
                { label: '最小值', value: true },
              ],
              'x-internal': {
                defaultValueFrom: 'customized',
              },
            },
            minimum: {
              type: 'string',
              'x-component': 'NumberPicker',
            },
          },
        },
        max: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-index': 12,
          'x-component-props': {
            grid: true,
            columns: 2,
          },
          properties: {
            maxSet: {
              type: 'object',
              'x-component': 'CheckboxGroup',
              enum: [
                { label: '最大值', value: true },
              ],
              'x-internal': {
                defaultValueFrom: 'customized',
              },
            },
            maximum: {
              type: 'string',
              'x-component': 'NumberPicker',
            },
          },
        },
        calculationFormula: {
          'x-component': 'CalculationFormulaBtn',
          'x-index': 13,
        },
      },
    },
  },
};

export default schema;
