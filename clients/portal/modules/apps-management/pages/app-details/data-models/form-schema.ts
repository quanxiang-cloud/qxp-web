export const BASIC_INFO_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    Fields: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        name: {
          type: 'string',
          title: '模型名称',
          required: true,
          maxLength: 20,
          'x-rules': {
            required: true,
            message: '请输入模型名称',
          },
          'x-component': 'Input',
          'x-index': 0,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        code: {
          type: 'string',
          title: '模型编码',
          required: true,
          'x-rules': {
            required: true,
            message: '请输入模型编码',
          },
          'x-component': 'Input',
          'x-index': 1,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        description: {
          type: 'string',
          title: '模型简介',
          maxLength: 100,
          'x-component': 'TextArea',
          'x-index': 2,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
      },
    },
  },
};

export const FIELD_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    Fields: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        title: {
          type: 'string',
          title: '名称',
          required: true,
          maxLength: 20,
          'x-rules': {
            required: true,
            message: '请输入名称',
          },
          'x-component': 'Input',
          'x-index': 0,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        key: {
          type: 'string',
          title: '编码',
          required: true,
          'x-rules': {
            required: true,
            message: '请输入编码',
          },
          'x-component': 'Input',
          'x-index': 1,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        isForeignKeys: {
          type: 'boolean',
          title: '是否作为外键',
          default: false,
          'x-component': 'Switch',
          'x-index': 2,
        },
        not_null: {
          type: 'boolean',
          title: '不允许为空',
          default: false,
          'x-component': 'Switch',
          'x-index': 3,
        },
        type: {
          type: 'string',
          title: '数据类型',
          'x-component': 'Select',
          enum: [
            {
              label: 'String（字符串）',
              value: 'string',
            },
            {
              label: 'Date（时间日期型）',
              value: 'datetime',
            },
            {
              label: 'Array（数组）',
              value: 'array',
            },
            {
              label: 'Number（数值型）',
              value: 'number',
            },
            {
              label: 'Boolean（布尔型）',
              value: 'boolean',
            },
          ],
          required: true,
          'x-rules': {
            required: true,
            message: '请选择数据类型',
          },
          'x-index': 4,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        format: {
          type: 'string',
          title: '日期格式',
          'x-component': 'Select',
          required: true,
          'x-rules': {
            required: true,
            message: '请选择日期格式',
          },
          enum: [
            {
              label: '年',
              value: 'YYYY',
            },
            {
              label: '年-月',
              value: 'YYYY-MM',
            },
            {
              label: '年-月-日',
              value: 'YYYY-MM-DD',
            },
            {
              label: '年-月-日 时-分',
              value: 'YYYY-MM-DD HH:mm',
            },
            {
              label: '年-月-日 时-分-秒',
              value: 'YYYY-MM-DD HH:mm:ss',
            },
          ],
          visible: false,
          'x-index': 5,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        length: {
          type: 'number',
          title: '长度',
          default: 50,
          required: true,
          'x-rules': {
            required: true,
            message: '请输入长度',
          },
          'x-component': 'NumberPicker',
          'x-index': 6,
          visible: false,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        digits: {
          type: 'number',
          title: ' 小数点',
          required: true,
          'x-rules': {
            required: true,
            message: '请输入小数点位数',
          },
          'x-component': 'NumberPicker',
          'x-index': 7,
          visible: false,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        validationRules: {
          type: 'string',
          title: '校验规则',
          'x-component': 'Select',
          enum: [
            {
              label: '唯一校验',
              value: 'only',
            },
            {
              label: '电子邮件',
              value: 'email',
            },
            {
              label: '手机号码',
              value: 'phone',
            },
            {
              label: '邮政编码',
              value: 'postalCode',
            },
            {
              label: '身份证号码',
              value: 'IDCard',
            },
            {
              label: '自定义校验规则',
              value: 'custom',
            },
          ],
          'x-index': 8,
          visible: false,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        regular: {
          type: 'string',
          title: '校验正则表达式',
          required: true,
          visible: false,
          'x-rules': {
            required: true,
            message: '请输入校验正则表达式',
          },
          'x-component': 'Input',
          'x-index': 9,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        subtype: {
          title: 'Array子类型',
          type: 'string',
          'x-component': 'Select',
          'x-index': 10,
          visible: false,
          required: true,
          'x-rules': {
            required: true,
            message: '请选择数组子类型',
          },
          enum: [
            {
              label: 'String（字符串）',
              value: 'string',
            },
            {
              label: 'Date（时间日期型）',
              value: 'datetime',
            },
            {
              label: 'Number（数值型）',
              value: 'number',
            },
            {
              label: 'Boolean（布尔型）',
              value: 'boolean',
            },
          ],
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
      },
    },
  },
};

export const FIELD_CONFIG_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    Fields: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        type: {
          type: 'string',
          title: '数据类型',
          'x-component': 'Select',
          enum: [
            {
              label: 'String（字符串）',
              value: 'string',
            },
            {
              label: 'Date（时间日期型）',
              value: 'datetime',
            },
            {
              label: 'Array（数组）',
              value: 'array',
            },
            {
              label: 'Number（数值型）',
              value: 'number',
            },
            {
              label: 'Boolean（布尔型）',
              value: 'boolean',
            },
          ],
          'x-index': 1,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        format: {
          type: 'string',
          title: '日期格式',
          'x-component': 'Select',
          required: true,
          'x-rules': {
            required: true,
            message: '请选择日期格式',
          },
          enum: [
            {
              label: '年',
              value: 'YYYY',
            },
            {
              label: '年-月',
              value: 'YYYY-MM',
            },
            {
              label: '年-月-日',
              value: 'YYYY-MM-DD',
            },
            {
              label: '年-月-日 时-分',
              value: 'YYYY-MM-DD HH:mm',
            },
            {
              label: '年-月-日 时-分-秒',
              value: 'YYYY-MM-DD HH:mm:ss',
            },
          ],
          'x-index': 2,
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-linkages': [{
            type: 'value:visible',
            target: 'type',
            condition: '{{ $value === "datetime" }}',
          }],
        },
        length: {
          type: 'number',
          title: '长度',
          default: 50,
          required: true,
          'x-rules': {
            required: true,
            message: '请输入长度',
          },
          'x-component': 'NumberPicker',
          'x-index': 3,
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-linkages': [{
            type: 'value:visible',
            target: 'type',
            condition: '{{ $value === "string" || $value === "number" }}',
          }],
        },
        digits: {
          type: 'number',
          title: ' 小数点',
          required: true,
          'x-rules': {
            required: true,
            message: '请输入小数点位数',
          },
          'x-component': 'NumberPicker',
          'x-index': 4,
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-linkages': [{
            type: 'value:visible',
            target: 'type',
            condition: '{{ $value === "number" }}',
          }],
        },
        validationRules: {
          type: 'string',
          title: '校验规则',
          'x-component': 'Select',
          'x-index': 5,
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-linkages': [{
            type: 'value:visible',
            target: 'type',
            condition: '{{ $value === "string" }}',
          }],
        },
      },
    },
  },
};
