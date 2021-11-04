export const FIELD_FORM_SCHEMA = {
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
          'x-rules': [
            {
              required: true,
              message: '请输入名称',
            },
            {
              pattern: /^((?!(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])).)*$/,
              message: '不能输入emoji表情符号',
            },
            {
              max: 30,
              message: '名称不超过 30 字符，请修改！',
            },
            {
              message: '不能以空白字符开头',
              pattern: /^\S/,
            },
          ],
          'x-component': 'Input',
          'x-index': 0,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        id: {
          type: 'string',
          title: '编码',
          required: true,
          'x-rules': [
            {
              required: true,
              message: '请输入模型编码',
            },
            {
              max: 30,
              message: '字段编码不超过 30 字符，请修改！',
            },
            {
              pattern: /^[a-zA-Z]+([_]?[a-zA-Z0-9])*$/,
              message: '必须以字母开头,由字母、数字、单下划线组成',
            },
          ],
          'x-component': 'Input',
          'x-index': 1,
          'x-mega-props': {
            labelAlign: 'top',
          },
        },
        // isForeignKeys: {
        //   type: 'boolean',
        //   title: '是否作为外键',
        //   default: false,
        //   'x-component': 'Switch',
        //   'x-index': 2,
        // },
        // foreignKeyModel: {
        //   type: 'string',
        //   title: '外键数据模型',
        //   required: true,
        //   'x-component': 'Select',
        //   'x-rules': {
        //     required: true,
        //     message: '请选择外键数据模型',
        //   },
        //   'x-index': 11,
        // },
        // foreignKeyField: {
        //   type: 'string',
        //   title: '外键字段',
        //   'x-rules': {
        //     required: true,
        //     message: '请选择外键字段',
        //   },
        //   'x-component': 'Select',
        //   'x-index': 12,
        // },
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
          maximum: 255,
          description: '范围0-255',
          minimum: 0,
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
          description: '最多支持到小数点后30位',
          maximum: 30,
          minimum: 0,
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
              label: '不校验',
              value: '',
            },
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
          'x-component-props': {
            allowClear: true,
          },
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
        subType: {
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
