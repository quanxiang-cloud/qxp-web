export const EnumReadOnly = [
  { label: '普通', value: 'normal' },
  { label: '只读', value: 'readonly' },
  { label: '隐藏', value: 'hidden' },
];

export const EnumOptionalRange = [
  { label: '全部部门', value: 'all' },
  { label: '自定义', value: 'customize' },
  { label: '当前用户所在部门', value: 'currentUserDep' },
];

export const EnumDefaultRange = [
  { label: '自定义', value: 'customize' },
  { label: '当前用户所在部门', value: 'currentUserDep' },
];

export const EnumMultiple = [
  { label: '单选', value: false },
  { label: '多选', value: true },
];

export interface Option {
  label: string,
  value: string
}
