// import { setBatchGlobalConfig } from '@lib/api/user-config';
import { ReactComponentNode } from '@one-for-all/artery';

export type PropsSpec = {
  label: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'react-node' | string;
  initialValue?: any;
  will?: string;
  willProps?: any;
  desc?: string;
};

const VERSION = '1.0.0';

export const base_props_spec: Record<string, PropsSpec[]> = {
  text: [
    {
      label: '文本内容',
      name: 'content',
      type: 'string',
      will: 'Textarea',
      initialValue: '文本',
    },
    {
      label: '可选中文本',
      name: 'isAllowSelect',
      type: 'boolean',
      will: 'Checkbox',
      initialValue: false,
    },
    {
      label: '点击事件',
      name: 'onClick',
      type: 'function',
    },
  ],
  para: [
    {
      label: '最大显示行数',
      name: 'maxLength',
      type: 'number',
      initialValue: 5,
    },
    {
      label: '文本内容',
      name: 'content',
      type: 'string',
      will: 'Textarea',
      initialValue: '文本',
    },
    {
      label: '可选中文本',
      name: 'isAllowSelect',
      type: 'boolean',
      will: 'Checkbox',
      initialValue: false,
    },
    {
      label: '点击事件',
      name: 'onClick',
      type: 'function',
    },
  ],
  image: [
    {
      label: '图片填充',
      name: 'imageUrl',
      type: 'string',
      will: 'ImageUrl',
    },
    {
      label: '填充方式',
      name: 'fillMode',
      type: 'string',
      will: 'Select',
      willProps: {
        options: [
          { label: '铺满', value: 'cover' },
          { label: '拉伸', value: 'contain' },
          { label: '适合', value: '100% 100%' },
        ],
      },
    },
    {
      label: '点击预览大图',
      name: 'preview',
      type: 'boolean',
      will: 'Switch',
    },
    {
      label: '点击遮罩关闭图片预览',
      name: 'closeOnMaskClick',
      type: 'boolean',
      will: 'Switch',
    },
  ],
  button: [
    {
      label: '按钮名称',
      name: 'children',
      type: 'string',
    },
    {
      label: '按钮类型',
      name: 'modifier',
      type: 'string',
      will: 'Select',
      willProps: {
        options: [
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
      will: 'Select',
      willProps: {
        options: [
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
  icon: [
    {
      label: '图标名称',
      name: 'name',
      type: 'string',
    },
    {
      label: '图标大小',
      name: 'size',
      type: 'number',
    },
  ],
  link: [
    {
      label: '内容',
      name: 'content',
      type: 'string',
    },
    {
      label: '链接类型',
      name: 'linkType',
      type: 'string',
      will: 'RadioGroup',
      willProps: {
        options: [
          {
            label: '外部链接',
            value: 'outside',
          },
          {
            label: '内部页面',
            value: 'inside',
          },
        ],
      },
      initialValue: 'outside',
    },
    {
      label: '链接类型',
      name: 'linkUrl',
      type: 'string',
      willProps: {
        placeholder: '请输入完整url路径 例：https://example.com',
      },
    },
    {
      label: '新开标签页',
      name: 'isBlank',
      type: 'boolean',
      willProps: {
        disabled: false,
      },
    },
    {
      label: '点击事件',
      name: 'onClick',
      type: 'function',
    },
  ],
  input: [
    {
      label: '类型',
      name: 'type',
      type: 'string',
      will: 'Select',
      willProps: {
        options: [
          {
            label: '文本框',
            value: 'text',
          },
          {
            label: '密码框',
            value: 'password',
          },
          {
            label: '数字',
            value: 'number',
          },
        ],
      },
    },
    {
      label: '占位符',
      name: 'placeholder',
      type: 'string',
      initialValue: '请输入内容',
    },
    {
      label: 'name',
      name: 'name',
      type: 'string',
    },
    {
      label: '禁用',
      name: 'disabled',
      type: 'boolean',
    },
    {
      label: '只读',
      name: 'readOnly',
      type: 'boolean',
    },
    {
      label: '错误',
      name: 'error',
      type: 'boolean',
    },
    {
      label: '最大长度',
      name: 'maxLength',
      type: 'number',
    },
    {
      label: '点击事件',
      name: 'onChange',
      type: 'function',
    },
    {
      label: '键盘按下事件',
      name: 'onKeydown',
      type: 'function',
    },
    {
      label: '聚焦事件',
      name: 'onFocus',
      type: 'function',
    },
    {
      label: '失焦事件',
      name: 'onBlur',
      type: 'function',
    },
  ],
  radio: [
    {
      label: '选项',
      name: 'radioOptions',
      type: 'string',
      will: 'Textarea',
      initialValue: '选项一\n选项二\n选项三\n',
    },
    {
      label: '变化事件',
      name: 'onChange',
      type: 'function',
    },
  ],
  textarea: [
    {
      label: '占位符',
      name: 'placeholder',
      type: 'string',
      initialValue: '请输入内容',
    },
    {
      label: '名称',
      name: 'name',
      type: 'string',
    },
    {
      label: '默认值',
      name: 'defaultValue',
      type: 'string',
    },
    {
      label: '行数',
      name: 'cols',
      type: 'number',
    },
    {
      label: '列数',
      name: 'rows',
      type: 'number',
    },
    {
      label: '最小输入字符',
      name: 'minLength',
      type: 'number',
    },
    {
      label: '最大输入字符',
      name: 'maxLength',
      type: 'number',
    },
  ],
  form: [
    { label: 'children', name: 'children', type: 'react-node' },
    {
      label: '名称',
      name: 'name',
      type: 'string',
    },
    {
      label: 'action',
      name: 'action',
      type: 'string',
    },
    {
      label: '请求方法',
      name: 'method',
      type: 'string',
      will: 'Select',
      willProps: {
        options: [
          {
            label: 'get',
            value: 'get',
          },
          {
            label: 'post',
            value: 'post',
          },
        ],
      },
      initialValue: 'get',
    },
    {
      label: '打开方式',
      name: 'target',
      type: 'string',
      will: 'Select',
      willProps: {
        options: [
          {
            label: '在新窗口打开',
            value: '_blank',
          },
          {
            label: '在当前窗口打开',
            value: '_self',
          },
        ],
      },
      initialValue: '_blank',
    },
  ],
  table: [
    {
      label: '单元格边框',
      type: 'boolean',
      name: 'hasBorder',
    },
    {
      label: '列配置',
      type: 'object',
      name: 'cols',
      will: 'TableBind',
    },
    {
      label: '',
      type: 'object',
      name: 'rows',
      willProps: {
        text: '绑定表格数据',
        type: 'array',
      },
    },
  ],
  iframe: [
    {
      label: 'iframe 地址',
      name: 'iframeAddr',
      type: 'string',
    },
    {
      label: 'iframe 宽度',
      name: 'iframeWidth',
      type: 'string',
      initialValue: 'auto',
    },
    {
      label: 'iframe 高度',
      name: 'iframeHeight',
      type: 'string',
      initialValue: 'auto',
    },
    {
      label: 'iframe 名称',
      name: 'iframeName',
      type: 'string',
    },
    {
      label: 'iframe 额外限制',
      name: 'sandbox',
      type: 'string',
      initialValue: 'allow-scripts allow-same-origin allow-forms',
    },
    {
      label: 'iframe 允许范围:',
      name: 'iframeAllow',
      type: 'string',
    },
    {
      label: '允许激活全屏模式',
      name: 'allowFullscreen',
      type: 'boolean',
    },
    {
      label: 'iframe 推荐配置',
      name: '',
      type: 'string',
      will: 'Select',
      willProps: {
        options: [
          { label: 'no-referrer',
            value: 'no-referrer' },
          { label: 'no-referrer-when-downgrade',
            value: 'no-referrer-when-downgrade' },
          { label: 'origin',
            value: 'origin' },
          { label: 'origin-when-cross-origin',
            value: 'origin-when-cross-origin' },
          { label: 'same-origin',
            value: 'same-origin' },
          { label: 'strict-origin',
            value: 'strict-origin' },
          { label: 'strict-origin-when-cross-origin',
            value: 'strict-origin-when-cross-origin' },
          { label: 'unsafe-url',
            value: 'unsafe-url' },
        ],
      },
    },
  ],
};

export const props_spec: { key: string; spec: PropsSpec[] }[] = [
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
        will: 'Select',
        willProps: {
          options: [
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
        will: 'Select',
        willProps: {
          options: [
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
  {
    key: 'CheckboxGroup',
    spec: [
      {
        label: '选项',
        name: 'options',
        type: 'string',
        will: 'Select',
        willProps: {
          options: [
            {
              label: '选项一',
              value: 'option1',
            },
            {
              label: '选项二',
              value: 'option2',
            },
            {
              label: '选项三',
              value: 'option3',
            },
          ],
        },
      },
      {
        label: '默认值',
        name: 'value',
        type: 'string',
      },
      {
        label: '禁用',
        name: 'disabled',
        type: 'boolean',
      },
      {
        label: 'onChange',
        name: 'onChange',
        type: 'function',
      },
    ],
  },
  {
    key: 'Divider',
    spec: [
      {
        label: '选项',
        name: 'direction',
        type: 'string',
        will: 'Select',
        willProps: {
          options: [
            {
              label: '水平',
              value: 'horizontal',
            },
            {
              label: '垂直',
              value: 'vertical',
            },
          ],
        },
      },
      {
        label: '大小',
        name: 'size',
        type: 'string',
        initialValue: '100%',
      },
      {
        label: '粗细',
        name: 'thickness',
        type: 'string',
        initialValue: '1px',
      },
    ],
  },
  {
    key: 'Input',
    spec: [
      {
        label: '占位符',
        name: 'placeholder',
        type: 'string',
        initialValue: '请输入内容',
      },
      {
        label: 'name',
        name: 'name',
        type: 'string',
      },
      {
        label: '禁用',
        name: 'disabled',
        type: 'boolean',
      },
      {
        label: '只读',
        name: 'readOnly',
        type: 'boolean',
      },
      {
        label: '错误',
        name: 'error',
        type: 'boolean',
      },
      {
        label: '最大长度',
        name: 'maxLength',
        type: 'number',
      },
      {
        label: 'onChange',
        name: 'onChange',
        type: 'function',
      },
      {
        label: 'onKeydown',
        name: 'onKeydown',
        type: 'function',
      },
      {
        label: 'onFocus',
        name: 'onFocus',
        type: 'function',
      },
      {
        label: 'onBlur',
        name: 'onBlur',
        type: 'function',
      },
    ],
  },
  {
    key: 'Breadcrumb',
    spec: [
      {
        label: '',
        name: 'segments',
        type: 'object',
        initialValue: [
          {
            key: 'one',
            text: '一级菜单',
          },
          {
            key: 'two',
            text: '二级菜单',
            path: 'https://www.google.com/',
          },
        ],
      },
      {
        label: '',
        name: 'separator',
        type: 'string',
        initialValue: '/',
      },
    ],
  },
  {
    key: 'Loading',
    spec: [
      {
        label: '描述',
        name: 'desc',
        type: 'string',
      },
      {
        label: '图标大小',
        name: 'iconSize',
        type: 'number',
      },
      {
        label: '水平',
        name: 'vertical',
        type: 'boolean',
      },
    ],
  },
  {
    key: 'RadioGroup',
    spec: [
      {
        label: '选项',
        name: 'options',
        type: 'object',
        initialValue: [
          {
            label: '选项一',
            value: 'option1',
          },
          {
            label: '选项二',
            value: 'option2',
          },
          {
            label: '选项三',
            value: 'option3',
            disabled: true,
          },
        ],
      },
      {
        label: '默认值',
        name: 'value',
        type: 'string',
        initialValue: 'option1',
      },
      {
        label: '禁用',
        name: 'disabled',
        type: 'boolean',
      },
      {
        label: 'onChange',
        name: 'onChange',
        type: 'function',
      },
    ],
  },
  {
    key: 'Switch',
    spec: [
      {
        label: '开启文案',
        name: 'onText',
        type: 'string',
      },
      {
        label: '关闭文案',
        name: 'offText',
        type: 'string',
        desc: '按钮的类型决定按钮的样式状态',
      },
      {
        label: 'onChange',
        name: 'onChange',
        type: 'function',
      },
    ],
  },
];

export function getConfigSpecKey({
  packageName,
  packageVersion,
}: ReactComponentNode): string {
  return `configspec:package:${packageName}@${packageVersion}`;
}

// props_spec.forEach((spec) => {
//   setBatchGlobalConfig([{
//     key: `configspec:package:headless-ui@1.0.0:exportName:${spec.key}`,
//     version: VERSION,
//     value: JSON.stringify(spec.spec),
//   }]);
// });
