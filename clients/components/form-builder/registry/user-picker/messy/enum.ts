export const EnumReadOnly = [
  { label: '普通', value: 'normal' },
  { label: '只读', value: 'readonly' },
  { label: '隐藏', value: 'hidden' },
];

export const EnumOptionalRange = [
  { label: '全部人员', value: 'all' },
  { label: '自定义', value: 'customize' },
];

export const EnumDefaultRange = [
  { label: '自定义', value: 'customize' },
  { label: '当前用户', value: 'currentUser' },
];

export const EnumMultiple = [
  { label: '单选', value: 'single' },
  { label: '多选', value: 'multiple' },
];

export interface Option {
  label: string,
  value: string
}
