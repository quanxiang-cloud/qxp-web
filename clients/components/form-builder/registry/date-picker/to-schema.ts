// just for type friendly
export const defaultConfig = {
  title: '时间日期',
  description: '',
  displayModifier: '',
  placeholder: '',
  sortable: false,
  valueFormat: '',
  required: false,
  valueFrom: 'customized',
};

type Schema = ISchema & { 'x-extend'?: Record<string, any> };

function toSchema(value: typeof defaultConfig): Schema {
  let xComponent = 'DatePicker';
  switch (value.valueFormat) {
  case 'YYYY':
    xComponent = 'YearPicker';
    break;
  case 'YYYY-MM':
    xComponent = 'MonthPicker';
    break;
  case 'YYYY-MM-DD':
    xComponent = 'DatePicker';
    break;
    // case 'YYYY-MM-DD HH:mm':
    //   break;
    // case 'YYYY-MM-DD HH:mm:ss':
    //   break;
  }

  return {
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    'x-component': xComponent,
    ['x-component-props']: {
      placeholder: value.placeholder,
      format: value.valueFormat,
    },
    ['x-extend']: {
      sortable: value.sortable,
    },
  };
}

export default toSchema;
