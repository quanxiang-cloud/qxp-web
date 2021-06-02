import { ISchema } from '@formily/react-schema-renderer';

import { deleteOperate, extraOperations } from '../../../operates';

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
          'x-component': 'Input',
          'x-mega-props': {
            labelAlign: 'top',
          },
          visible: false,
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
        //   'x-mega-props': {
        //     labelAlign: 'top',
        //   },
        //   'x-index': 4,
        // },
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
            renderAddition: () => null,
          },
          'x-index': 8,
          items: {
            type: 'object',
            properties: {
              label: {
                type: 'string',
                title: '选项',
                required: true,
                'x-component': 'Input',
                'x-index': 1,
              },
            },
          },
        },
        add: {
          type: 'object',
          'x-component': 'addOperate',
        },
      },
    },
  },
};

export default schema;
