import moment from 'moment';

type Validator = (currentCompareValue: string, format: string) => boolean;

export const compareValueValidateMap: Record<string, Validator> = {
  Input: (currentCompareValue: string) => {
    return typeof currentCompareValue !== 'string' ? true : false;
  },
  DatePicker: (currentCompareValue: string, format: string) => {
    return moment(currentCompareValue).format(format) === 'Invalid date' ? true : false;
  },
  NumberPicker: (currentCompareValue: string) => {
    return typeof currentCompareValue !== 'number' ? true : false;
  },
  MultipleSelect: (currentCompareValue: string) => {
    return typeof currentCompareValue !== 'object' ? true : false;
  },
  CheckboxGroup: (currentCompareValue: string) => {
    return typeof currentCompareValue !== 'object' ? true : false;
  },
  RadioGroup: (currentCompareValue: string) => {
    return typeof currentCompareValue !== 'object' ? true : false;
  },
  Select: (currentCompareValue: string) => {
    return typeof currentCompareValue !== 'object' ? true : false;
  },
};
