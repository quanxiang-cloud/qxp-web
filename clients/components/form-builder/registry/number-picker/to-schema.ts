// just for type friendly
export const defaultConfig = {
  title: '数字',
  description: '',
  displayModifier: '',
  placeholder: '',
  sortable: true,
  valueFormat: '',
  required: false,
  defaultValue: '',
};

type Schema = ISchema & { 'x-extend'?: Record<string, any> };

function toSchema(value: typeof defaultConfig): Schema {
  return {
    title: value.title,
    description: value.description,
    required: value.required,
    format: value.valueFormat,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    'x-component': 'NumberPicker',
    ['x-component-props']: {
      placeholder: value.placeholder,
    },
    ['x-extend']: {
      sortable: value.sortable,
    },
  };
}

export default toSchema;
