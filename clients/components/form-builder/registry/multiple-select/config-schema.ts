import { ISchema } from '@formily/react-schema-renderer';
import { deleteOperate, extraOperations, addOperate } from '../operates';

const schema: ISchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: '标题名称',
      default: '下拉框',
      required: true,
      // https://github.com/alibaba/formily/issues/1053
      // this bug has not been fix in current release
      // description: '标题名称',
      'x-rules': {
        required: true,
        message: '请输入标题名称',
      },
      'x-component': 'Input',
      'x-index': 0,
    },
    description: {
      type: 'string',
      title: '描述内容',
      'x-component': 'Input',
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
      'x-index': 3,
    },
    // optionsLayout: {
    //   type: 'string',
    //   title: '排列方式',
    //   default: 'horizontal',
    //   enum: [
    //     {
    //       label: '横向排列',
    //       value: 'horizontal',
    //     },
    //     {
    //       label: '纵向排列',
    //       value: 'vertical',
    //     },
    //   ],
    //   'x-component': 'RadioGroup',
    //   'x-index': 4,
    // },
    sortable: {
      title: '是否支持列表排序',
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
    availableOptions: {
      type: 'array',
      'x-component': 'ArrayTable',
      'x-component-props': {
        operationsWidth: 80,
        renderRemove: deleteOperate,
        renderMoveDown: () => null,
        renderMoveUp: () => null,
        renderExtraOperations: extraOperations,
        renderAddition: addOperate,
      },
      'x-index': 7,
      items: {
        type: 'object',
        properties: {
          label: {
            title: '选项',
            type: 'string',
            'x-component': 'Input',
          },
        },
      },
    },
  },
};

export default schema;
