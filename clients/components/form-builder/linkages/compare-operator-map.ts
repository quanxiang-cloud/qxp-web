type Comparator = (leftValue: any, rightValue: any) => boolean;
type OperatorContext = { op: string; title: string; comparator: Comparator; };

const compareOperatorMap: Record<FormBuilder.CompareOperator, OperatorContext> = {
  '==': {
    title: '等于',
    op: 'eq',
    comparator: (leftValue: string | number, rightValue: string | number): boolean => {
      return leftValue === rightValue;
    },
  },
  '!=': {
    title: '不等于',
    op: 'not eq',
    comparator: (leftValue: string | number, rightValue: string | number): boolean => {
      return leftValue !== rightValue;
    },
  },
  '>': {
    title: '大于',
    op: 'gt',
    comparator: (leftValue: number, rightValue: number): boolean => {
      return leftValue > rightValue;
    },
  },
  '>=': {
    title: '大于等于',
    op: 'gte',
    comparator: (leftValue: number, rightValue: number): boolean => {
      return leftValue >= rightValue;
    },
  },
  '<': {
    title: '小于',
    op: 'lt',
    comparator: (leftValue: number, rightValue: number): boolean => {
      return leftValue < rightValue;
    },
  },
  '<=': {
    title: '小于等于',
    op: 'lte',
    comparator: (leftValue: number, rightValue: number): boolean => {
      return leftValue <= rightValue;
    },
  },
  '∈': {
    title: '属于',
    op: 'in',
    comparator: (leftValue: Array<string | number>, rightValue: Array<string | number>): boolean => {
      return leftValue.every((value) => {
        return rightValue.includes(value);
      });
    },
  },
  '∉': {
    title: '不属于',
    op: 'not in',
    comparator: (leftValue: Array<string | number>, rightValue: Array<string | number>): boolean => {
      return leftValue.find((value) => {
        return !rightValue.includes(value);
      }) ? true : false;
    },
  },
  '⊇': {
    title: '全部包含',
    op: 'include',
    comparator: (leftValue: Array<string | number>, rightValue: Array<string | number>): boolean => {
      return rightValue.every((value) => {
        return leftValue.includes(value);
      });
    },
  },
  '⊋': {
    title: '不包含',
    op: 'exclude',
    comparator: (leftValue: Array<string | number>, rightValue: Array<string | number>): boolean => {
      return rightValue.find((value) => {
        return !leftValue.includes(value);
      }) ? true : false;
    },
  },
  '∩': {
    title: '任一',
    op: 'intersection',
    comparator: (leftValue: Array<string | number>, rightValue: Array<string | number>): boolean => {
      return rightValue.find((value) => {
        return leftValue.includes(value);
      }) ? true : false;
    },
  },
  // todo Add array equal realation map
  '~': {
    title: '相似',
    op: 'like',
    comparator: (leftValue: string, rightValue: string): boolean => {
      return leftValue.toLowerCase().includes(rightValue.toLowerCase());
    },
  },
  '()': {
    title: '在范围内',
    op: 'between',
    comparator: (leftValue: number, rightValue: [number, number]): boolean => {
      return leftValue > rightValue[0] && leftValue < rightValue[1];
    },
  },
};

export default compareOperatorMap;
