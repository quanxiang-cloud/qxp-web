import React, { useContext } from 'react';
import { ISchema } from '@formily/react-schema-renderer';

import Icon from '@c/icon';
import Button from '@c/button';
import { FieldConfigContext } from '../../form-settings-panel/form-field-config-context';

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
        operationsWidth: 80,
        renderRemove: (idx: number) => {
          const { actions } = useContext(FieldConfigContext);

          const mutator = actions.createMutators('availableOptions');

          return (
            <>
              <div style={{ position: 'relative', height: '32px' }}>
                <Icon
                  className="operate-icon"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  name="delete"
                  size={24}
                  onClick={() => {
                    mutator.remove(idx);
                  }}
                />
              </div>
            </>
          );
        },
        renderMoveDown: () => null,
        renderMoveUp: () => null,
        renderExtraOperations: (idx: number) => {
          const { actions } = useContext(FieldConfigContext);

          const mutator = actions.createMutators('availableOptions');

          return (
            <>
              <div className="ml-28">
                <Icon
                  className="operate-icon"
                  name="keyboard_arrow_up"
                  onClick={() => {
                    mutator.moveUp(idx);
                  }}
                />
                <Icon
                  className="operate-icon"
                  name="keyboard_arrow_down"
                  onClick={() => {
                    mutator.moveDown(idx);
                  }}
                />
              </div>
            </>
          );
        },
        renderAddition: () => {
          return <Button>添加选项</Button>;
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
