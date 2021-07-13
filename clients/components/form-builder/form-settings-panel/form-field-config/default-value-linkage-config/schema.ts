const schema: ISchema = {
  type: 'object',
  properties: {
    linkedTableID: {
      title: '联动表单',
      type: 'string',
      'x-component': 'AntdSelect',
    },
    sortByAndSortOrder: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': { inline: true },
      properties: {
        sortBy: {
          title: '取值规则',
          type: 'string',
          'x-component': 'AntdSelect',
        },
        sortOrder: {
          'x-component': 'RadioGroup',
          default: false,
          enum: [
            { label: '升序', value: '+' },
            { label: '降序', value: '-' },
          ],
        },
      },
    },
    ruleJoinOperator: {
      type: 'string',
      'x-component': 'JoinOperatorSelect',
    },
    rules: {
      type: 'array',
      'x-component': 'RulesList',
      items: {
        type: 'object',
        properties: {
          fieldName: {
            type: 'string',
            required: true,
            'x-component': 'AntdSelect',
          },
          compareOperator: {
            type: 'string',
            required: true,
            'x-component': 'AntdSelect',
            enum: [
              { label: '等于', value: '==' },
            ],
          },
          compareTo: {
            type: 'string',
            required: true,
            enum: [
              { label: '表单值', value: 'currentFormValue' },
              { label: '固定值', value: 'fixedValue' },
            ],
            'x-component': 'AntdSelect',
          },
          compareValue: {
            type: 'string',
            required: true,
            'x-component': 'AntdSelect',
          },
        },
      },
    },
    linkedField: {
      type: 'string',
      title: '联动显示为',
      required: true,
      'x-component': 'AntdSelect',
    },
  },
};

export default schema;
