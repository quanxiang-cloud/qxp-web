import React from 'react';
import { ISchema, useForm } from '@formily/react-schema-renderer';

import Icon from '@c/icon';
import Button from '@c/button';

const schema: ISchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: '标题名称',
      default: '单选框',
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
      'x-index': 4,
    },
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
    valueSource: {
      title: '默认值',
      enum: [
        {
          label: '自定义',
          value: 'customized',
        },
        {
          label: '数据联动',
          value: 'linkage',
        },
        {
          label: '自定义公式',
          value: 'formula',
        },
      ],
      'x-component': 'select',
      'x-index': 7,
      'x-linkages': [
        {
          type: 'value:visible',
          target: 'availableOptions',
          condition: '{{ $self.value === "customized" }}',
        },
      ],
    },
    availableOptions: {
      type: 'array',
      'x-component': 'ArrayTable',
      'x-component-props': {
        draggable: true,
        operationsWidth: 100,
        renderMoveUp: () => null,
        renderMoveDown: () => null,
        renderAddition: () => {
          return <Button>添加选项</Button>;
        },
        renderRemove: (idx: number) => {
          const { createMutators } = useForm({});
          // const actions = useContext(ActionContext);

          const mutator = createMutators('availableOptions');
          debugger;
          return (<Icon
            style={{ cursor: 'pointer' }}
            name="delete"
            size={24}
            onClick={() => {
              console.log(idx);
              mutator.remove(idx);
            }}
          />);
        },
      },
      'x-index': 8,
      items: {
        type: 'object',
        properties: {
          label: {
            type: 'string',
            title: '选项',
            'x-component': 'Input',
            'x-index': 1,
          },
        },
      },
    },
  },
};

export default schema;
