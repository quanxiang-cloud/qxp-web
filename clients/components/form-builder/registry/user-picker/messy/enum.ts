export const EnumReadOnly = [
  { label: '普通', value: 'normal' },
  { label: '只读', value: 'readonly' },
  { label: '隐藏', value: 'hidden' },
];

export const EnumOptionalRange = [
  { label: '全部部门', value: 'all' },
  { label: '自定义', value: 'customize' },
  { label: '我的部门', value: 'myDep' },
];

export const EnumMultiple = [
  { label: '单选', value: 'single' },
  { label: '多选', value: 'multiple' },
];

export interface Option {
    label: string,
    value: string
}
