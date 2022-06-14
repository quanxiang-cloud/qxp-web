import { CSSProperties } from 'react';

export const SIZE_KEYS: (keyof CSSProperties)[] = ['width', 'minWidth', 'maxWidth', 'height', 'minHeight', 'maxHeight'];
export const PADDING_KEYS: (keyof CSSProperties)[] = ['padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'];
export const MARGIN_KEYS: (keyof CSSProperties)[] = ['margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight'];
export const POSITION_KEYS: (keyof CSSProperties)[] = ['top', 'bottom', 'left', 'right'];
export const BORDER_KEYS: (keyof CSSProperties)[] = ['borderWidth', 'borderTopWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderRightWidth', 'borderColor', 'borderStyle',
  'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius',
];
export const DISPLAY_KEYS: (keyof CSSProperties)[] = ['display', 'flexDirection', 'justifyContent', 'alignItems'];
export const TYPOGRAPHY_KEYS: (keyof CSSProperties)[] = ['fontSize', 'color', 'lineHeight', 'letterSpacing', 'fontWeight', 'textAlign', 'textTransform', 'textDecoration'];
export const BACKGROUND_KEYS: (keyof CSSProperties)[] = ['backgroundSize', 'backgroundRepeat', 'backgroundColor', 'backgroundImage'];
export const BOX_SHADOW_KEY: (keyof CSSProperties)[] = ['boxShadow'];

export const DISPLAY_OPTION: LabelValue[] = [
  { value: 'block', label: '块级' },
  { value: 'inline', label: '行内' },
  { value: 'inline-block', label: '行内块' },
  { value: 'flex', label: '弹性' },
];

export const DIRECTION_LIST: LabelValue[] = [
  {
    value: 'row',
    label: '水平方向',
  },
  {
    value: 'column',
    label: '垂直方向',
  },
  {
    value: 'row-reverse',
    label: '反向水平方向',
  },
  {
    value: 'column-reverse',
    label: '反向垂直方向',
  },
];

export const FLEX_CONTENT_COMMON_VALUE: LabelValue[] = [
  {
    value: 'flex-start',
    label: '从行部开始排列',
  },
  {
    value: 'center',
    label: '居中排列',
  },
  {
    value: 'flex-end',
    label: '从尾部开始排列',
  },
];

export const JUSTIFY_CONTENT_VALUE = FLEX_CONTENT_COMMON_VALUE.concat([
  {
    value: 'space-between',
    label: '每个元素之间空间相同且均匀排列',
  },
  {
    value: 'space-around',
    label: '每个元素两侧空间相同且均匀排列',
  },
]);

export const ALIGN_CONTENT_VALUE = FLEX_CONTENT_COMMON_VALUE.concat([
  {
    value: 'stretch',
    label: '拉伸元素',
  },
  {
    value: 'baseline',
    label: '基线对齐',
  },
]);

export const JUSTIFY_ICON_MAP: Record<string, string> = {
  'flex-start': 'row_justify_flex-start',
  center: 'row_justify_center',
  'flex-end': 'row_justify_flex-end',
  'space-between': 'row_justify_stretch',
  'space-around': 'row_justify_baseline',
};

export const ALIGN_ICON_MAP: Record<string, string> = {
  'flex-start': 'row_align_flex-start',
  center: 'row_align_center',
  'flex-end': 'row_align_flex-end',
  stretch: 'row_align_stretch',
  baseline: 'row_align_baseline',
};

export const TEXT_ALIGN: LabelValue[] = [
  {
    label: '左对其',
    value: 'left',
  },
  {
    label: '居中',
    value: 'center',
  },
  {
    label: '右对其',
    value: 'right',
  },
  {
    label: '两侧对其',
    value: 'justify',
  },
];

export const TEXT_TRANSFORM: LabelValue[] = [
  {
    label: '全大写',
    value: 'uppercase',
  },
  {
    label: '仅首字母大写',
    value: 'capitalize',
  },
  {
    label: '全小写',
    value: 'lowercase',
  },
];

export const FONT_WEIGHT: LabelValue[] = [
  {
    label: 'bolder',
    value: 'bolder',
  },
  {
    label: 'lighter',
    value: 'lighter',
  },
].concat(new Array(9).fill('').map((_, i) => ({
  label: ((i + 1) * 100).toString(),
  value: ((i + 1) * 100).toString(),
})));

export const TEXT_CONTENT_MAP: Record<string, string> = {
  uppercase: 'AA',
  lowercase: 'aa',
  capitalize: 'Aa',
};

export const BORDER_POSITION: LabelValue[] = [
  {
    label: '所有',
    value: '',
  },
  {
    label: '上',
    value: 'Top',
  },
  {
    label: '下',
    value: 'Bottom',
  },
  {
    label: '左',
    value: 'Left',
  },
  {
    label: '右',
    value: 'Right',
  },
];

export const BORDER_STYLE: LabelValue[] = [
  {
    label: '无边框',
    value: 'none',
  },
  {
    label: '实线',
    value: 'solid',
  },
  {
    label: '圆点',
    value: 'dotted',
  },
  {
    label: '短横线',
    value: 'dashed',
  },
];

export const BORDER_RADIUS = [
  {
    label: '无圆角',
    value: '',
  },
  {
    label: '所有',
    value: 'all',
  },
  {
    label: '左上',
    value: 'TopLeft',
  },
  {
    label: '右上',
    value: 'TopRight',
  },
  {
    label: '左下',
    value: 'BottomLeft',
  },
  {
    label: '右下',
    value: 'BottomRight',
  },
];

export const BG_SIZE: LabelValue[] = [
  {
    label: '自动比例缩放',
    value: 'auto',
  },
  {
    label: '缩放图片以覆盖',
    value: 'cover',
  },
  {
    label: '缩放图片以完全展示',
    value: 'contain',
  },
];

export const BG_REPEAT: LabelValue[] = [
  {
    label: '不重复',
    value: 'no-repeat',
  },
  {
    label: '重复',
    value: 'repeat',
  },
  {
    label: '仅横向重复',
    value: 'repeat-x',
  },
  {
    label: '仅纵向重复',
    value: 'repeat-y',
  },
  {
    label: '均匀重复',
    value: 'space',
  },
  {
    label: '重复并拉伸',
    value: 'round',
  },
];

export const SHADOW_TYPE: LabelValue[] = [
  {
    label: '无阴影',
    value: 'none',
  },
  {
    label: '内阴影',
    value: 'inset',
  },
  {
    label: '外阴影',
    value: 'outset',
  },
];

