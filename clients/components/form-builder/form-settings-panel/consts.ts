export const OPERATORS = {
  Default: [
    { value: '==', label: '等于' },
    { value: '!=', label: '不等于' },
  ],
  Multiple: [
    { value: '⊇', label: '全部包含' },
    { value: '∩', label: '任一' },
  ],
  Date: [
    { value: '=', label: '等于' },
    { value: '!=', label: '不等于' },
    { value: '>', label: '早于' },
    { value: '<', label: '晚于' },
  ],
  Number: [
    { value: '=', label: '等于' },
    { value: '!=', label: '不等于' },
    { value: '>', label: '大于' },
    { value: '<', label: '小于' },
    { value: '>=', label: '大于等于' },
    { value: '<=', label: '小于等于' },
  ],
};
