import { OPERATORS } from './consts';
export function operatorOption(type: any): any {
  let operators = OPERATORS.Default;
  switch (type) {
  case 'MultipleSelect':
    operators = OPERATORS.Multiple;
    break;
  case 'CheckboxGroup':
    operators = OPERATORS.Multiple;
    break;
  case 'DatePicker':
    operators = OPERATORS.Date;
    break;
  case 'NumberPicker':
    operators = OPERATORS.Number;
    break;
  default:
    operators = OPERATORS.Default;
    break;
  }

  return operators;
}
