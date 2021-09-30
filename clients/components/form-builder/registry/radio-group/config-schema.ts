import { deleteOperate, extraOperations } from '../operates';

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
          default: '单选框',
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
        description: {
          type: 'string',
          title: '描述内容',
          maxLength: 50,
          'x-component': 'Input',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 2,
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
          'x-index': 3,
        },
        optionsLayout: {
          type: 'string',
          title: '排列方式',
          default: 'horizontal',
          enum: [
            {
              label: '横向排列',
              value: 'horizontal',
            },
            {
              label: '纵向排列',
              value: 'vertical',
            },
          ],
          'x-component': 'RadioGroup',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 4,
        },
        sortable: {
          title: '列表排序',
          default: false,
          'x-component': 'Switch',
          'x-index': 5,
        },
        required: {
          title: '是否必填',
          default: false,
          'x-component': 'Switch',
          'x-index': 6,
        },
        allowCustom: {
          title: '允许自定义',
          default: false,
          'x-component': 'Switch',
          'x-index': 7,
        },
        defaultValueFrom: {
          type: 'string',
          title: '选项来源',
          default: 'customized',
          enum: [
            {
              label: '自定义',
              value: 'customized',
            },
            {
              label: '选项集',
              value: 'dataset',
            },
            // {
            //   label: '关联已有数据',
            //   value: 'linkage',
            // },
            // {
            //   label: '通过公式计算',
            //   value: 'formula',
            // },
          ],
          'x-component': 'select',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 8,
          'x-linkages': [
            {
              type: 'value:state',
              target: 'availableOptions',
              state: {
                display: '{{ $value ==="customized" }}',
              },
            },
            {
              type: 'value:state',
              target: 'add',
              state: {
                display: '{{ $value === "customized" }}',
              },
            },
            {
              type: 'value:visible',
              target: 'edit',
              condition: '{{ $value === "customized" }}',
            },
            {
              type: 'value:visible',
              target: 'linkageConfig',
              condition: '{{ $value === "linkage" }}',
            },
            {
              type: 'value:visible',
              target: 'datasetId',
              condition: '{{ $value === "dataset" }}',
            },
          ],
        },
        linkageConfig: {
          'x-component': 'DefaultValueLinkageConfigBtn',
          'x-index': 9,
        },
        availableOptions: {
          type: 'array',
          'x-component': 'ArrayTable',
          'x-component-props': {
            operationsWidth: 80,
            renderRemove: deleteOperate,
            renderMoveDown: () => null,
            renderMoveUp: () => null,
            renderExtraOperations: extraOperations,
            renderAddition: () => null,
          },
          'x-index': 10,
          items: {
            type: 'object',
            properties: {
              label: {
                title: '选项',
                type: 'string',
                required: true,
                'x-component': 'Input',
                'x-component-props': {
                  maxLength: 50,
                },
              },
              isDefault: {
                type: 'string',
                'x-component': 'CheckBox',
              },
            },
          },
        },
        operates: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-index': 11,
          'x-component-props': {
            grid: true,
            columns: 2,
          },
          properties: {
            add: {
              type: 'string',
              'x-component': 'AddOperate',
            },
            edit: {
              type: 'string',
              'x-component': 'EditLabels',
            },
          },
        },
        datasetId: {
          title: '选项集',
          required: true,
          triggerType: 'onBlur',
          'x-rules': {
            required: true,
            message: '请选择选项集',
          },
          'x-component': 'DatasetConfig',
          'x-mega-props': {
            labelAlign: 'top',
          },
          'x-index': 12,
        },
      },
    },
  },
};

export default schema;
