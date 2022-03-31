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

type Validator = (value: unknown, format?: string) => boolean;

export const compareValueValidateMap: Record<string, Validator> = {
  input: (value: unknown) => {
    if (typeof value === 'string') {
      return value.startsWith('field_') || value.startsWith('subtable_field');
    }

    return false;
  },
  datepicker: (value: unknown, format?: string) => {
    return moment(value as string).format(format) === 'Invalid date';
  },
  numberpicker: (value: unknown) => {
    return typeof value !== 'number';
  },
  multipleselect: (value: unknown) => {
    return typeof value !== 'object';
  },
  checkboxgroup: (value: unknown) => {
    return typeof value !== 'object';
  },
  radiogroup: (value: unknown) => {
    return typeof value !== 'object';
  },
  select: (value: unknown) => {
    return typeof value !== 'object';
  },
};
