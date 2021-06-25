type CollectionOperator = '∈' | '∉';
type BinaryOperator = '<=' | '<' | '>=' | '>' | '==' | '!=' | '+' | '-' | '*' | '/' | '%';
type LogicalOperator = '||' | '&&';

export const collectionOperators = [
  {
    tips: '',
    content: '∈',
  },
  {
    tips: '',
    content: '∉',
  },
];

const operators = [
  {
    tips: '',
    content: '<=',
  },
  {
    tips: '',
    content: '<',
  },
  {
    tips: '',
    content: '>=',
  },
  {
    tips: '',
    content: '>',
  },
  {
    tips: '',
    content: '==',
  },
  {
    tips: '',
    content: '!=',
  },
  {
    tips: '',
    content: '+',
  },
  {
    tips: '',
    content: '-',
  },
  {
    tips: '',
    content: '*',
  },
  {
    tips: '',
    content: '/',
  },
  {
    tips: '',
    content: '%',
  },
  {
    tips: '',
    content: '||',
  },
  {
    tips: '',
    content: '&&',
  },
  ...collectionOperators,
];

export default operators;
