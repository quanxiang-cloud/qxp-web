export type Props_Spec = {
  label: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | string;
  initialValue?: any;
  will?: string;
  willProps?: Record<string, unknown>;
  desc?: string;
}

export const props_spec: {key: string; spec: Props_Spec[]}[] = [
  {
    key: 'button',
    spec: [
      {
        label: '按钮名称',
        name: 'children',
        type: 'string',
      },
      {
        label: '按钮类型',
        name: 'modifier',
        type: 'string',
        will: 'Switch',
        willProps: {
          option: [
            {
              label: '默认',
              value: '',
            },
            {
              label: '主要',
              value: 'primary',
            },
            {
              label: '危险',
              value: 'danger',
            },
          ],
        },
        initialValue: '',
      },
      {
        label: '按钮功能',
        name: 'type',
        type: 'string',
        will: 'select',
        willProps: {
          option: [
            {
              label: '按钮',
              value: 'button',
            },
            {
              label: '提交',
              value: 'submit',
            },
            {
              label: '重置',
              value: 'reset',
            },
          ],
        },
        initialValue: 'button',
      },
      {
        label: '禁用',
        name: 'forbidden',
        type: 'boolean',
        initialValue: false,
      },
      {
        label: '加载状态',
        name: 'loading',
        type: 'boolean',
      },
      {
        label: '加载文本',
        name: 'loadingText',
        type: 'string',
      },
      {
        label: '图标名称',
        name: 'iconName',
        type: 'string',
      },
      {
        label: '图标大小',
        name: 'iconSize',
        type: 'number',
      },
      {
        label: '点击事件',
        name: 'onClick',
        type: 'function',
      },
    ],
  },
  // {
  //   key: 'CheckboxGroup',
  //   spec: [
  //     {
  //       label: '选项',
  //       name: 'options',
  //       type: 'object',
  //       initialValue: [
  //         {
  //           label: '选项一',
  //           value: 'option1',
  //         },
  //         {
  //           label: '选项二',
  //           value: 'option2',
  //         },
  //         {
  //           label: '选项三',
  //           value: 'option3',
  //           disabled: true,
  //         },
  //       ],
  //     },
  //     {
  //       label: '默认值',
  //       name: 'value',
  //       type: 'string',
  //       initialValue: 'option1',
  //     },
  //     {
  //       label: '禁用',
  //       name: 'disabled',
  //       type: 'boolean',
  //     },
  //     {
  //       label: 'onChange',
  //       name: 'onChange',
  //       type: 'function',
  //     },
  //   ],
  // },
  // {
  //   key: 'Divider',
  //   spec: [
  //     {
  //       label: '选项',
  //       name: 'direction',
  //       type: 'string',
  //       will: 'select',
  //       willProps: {
  //         options: [
  //           {
  //             label: '水平',
  //             value: 'horizontal',
  //           },
  //           {
  //             label: '垂直',
  //             value: 'vertical',
  //           },
  //         ],
  //       },
  //       initialValue: 'horizontal',
  //     },
  //     {
  //       label: '大小',
  //       name: 'size',
  //       type: 'string',
  //       initialValue: '100%',
  //     },
  //     {
  //       label: '粗细',
  //       name: 'thickness',
  //       type: 'string',
  //       initialValue: '1px',
  //     },
  //   ],
  // },
  // {
  //   key: 'Input',
  //   spec: [
  //     {
  //       label: '占位符',
  //       name: 'placeholder',
  //       type: 'string',
  //       initialValue: '请输入内容',
  //     },
  //     {
  //       label: 'name',
  //       name: 'name',
  //       type: 'string',
  //     },
  //     {
  //       label: '禁用',
  //       name: 'disabled',
  //       type: 'boolean',
  //     },
  //     {
  //       label: '只读',
  //       name: 'readOnly',
  //       type: 'boolean',
  //     },
  //     {
  //       label: '错误',
  //       name: 'error',
  //       type: 'boolean',
  //     },
  //     {
  //       label: '最大长度',
  //       name: 'maxLength',
  //       type: 'number',
  //     },
  //     {
  //       label: 'onChange',
  //       name: 'onChange',
  //       type: 'function',
  //     },
  //     {
  //       label: 'onKeydown',
  //       name: 'onKeydown',
  //       type: 'function',
  //     },
  //     {
  //       label: 'onFocus',
  //       name: 'onFocus',
  //       type: 'function',
  //     },
  //     {
  //       label: 'onBlur',
  //       name: 'onBlur',
  //       type: 'function',
  //     },
  //   ],
  // },
  // {
  //   key: 'Breadcrumb',
  //   spec: [
  //     {
  //       label: '',
  //       name: 'segments',
  //       type: 'object',
  //       initialValue: [
  //         {
  //           key: 'one',
  //           text: '一级菜单',
  //         },
  //         {
  //           key: 'two',
  //           text: '二级菜单',
  //           path: 'https://www.google.com/',
  //         },
  //       ],
  //     },
  //     {
  //       label: '',
  //       name: 'separator',
  //       type: 'string',
  //       initialValue: '/',
  //     },
  //   ],
  // },
  // {
  //   key: 'Loading',
  //   spec: [
  //     {
  //       label: '描述',
  //       name: 'desc',
  //       type: 'string',
  //     },
  //     {
  //       label: '图标大小',
  //       name: 'iconSize',
  //       type: 'number',
  //     },
  //     {
  //       label: '水平',
  //       name: 'vertical',
  //       type: 'boolean',
  //     },
  //   ],
  // },
  // {
  //   key: 'RadioGroup',
  //   spec: [
  //     {
  //       label: '选项',
  //       name: 'options',
  //       type: 'object',
  //       initialValue: [
  //         {
  //           label: '选项一',
  //           value: 'option1',
  //         },
  //         {
  //           label: '选项二',
  //           value: 'option2',
  //         },
  //         {
  //           label: '选项三',
  //           value: 'option3',
  //           disabled: true,
  //         },
  //       ],
  //     },
  //     {
  //       label: '默认值',
  //       name: 'value',
  //       type: 'string',
  //       initialValue: 'option1',
  //     },
  //     {
  //       label: '禁用',
  //       name: 'disabled',
  //       type: 'boolean',
  //     },
  //     {
  //       label: 'onChange',
  //       name: 'onChange',
  //       type: 'function',
  //     },
  //   ],
  // },
  // {
  //   key: 'Switch',
  //   spec: [
  //     {
  //       label: '开启文案',
  //       name: 'onText',
  //       type: 'string',
  //     },
  //     {
  //       label: '关闭文案',
  //       name: 'offText',
  //       type: 'string',
  //       desc: '按钮的类型决定按钮的样式状态',
  //     },
  //     {
  //       label: 'onChange',
  //       name: 'onChange',
  //       type: 'function',
  //     },
  //   ],
  // },
];
