// todo remove this
import moment from 'moment';
import { OPERATORS } from '../constants';

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

type Validator = (currentCompareValue: string, format?: string) => boolean;

export const compareValueValidateMap: Record<string, Validator> = {
  input: (currentCompareValue: string) => {
    return typeof currentCompareValue !== 'string' ? true : false;
  },
  datepicker: (currentCompareValue: string, format?: string) => {
    return moment(currentCompareValue).format(format) === 'Invalid date' ? true : false;
  },
  numberpicker: (currentCompareValue: string) => {
    return typeof currentCompareValue !== 'number' ? true : false;
  },
  multipleselect: (currentCompareValue: string) => {
    return typeof currentCompareValue !== 'object' ? true : false;
  },
  checkboxgroup: (currentCompareValue: string) => {
    return typeof currentCompareValue !== 'object' ? true : false;
  },
  radiogroup: (currentCompareValue: string) => {
    return typeof currentCompareValue !== 'object' ? true : false;
  },
  select: (currentCompareValue: string) => {
    return typeof currentCompareValue !== 'object' ? true : false;
  },
};
