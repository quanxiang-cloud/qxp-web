// just for type friendly
export const defaultConfig = {
  title: '单行文本',
  description: '',
  displayModifier: '',
  placeholder: '',
  sortable: false,
  valueFormat: '',
  required: false,
  valueFrom: 'customized',
};

type Schema = ISchema & { 'x-internal'?: Record<string, any> };

function toSchema(value: typeof defaultConfig): Schema {
  return {
    title: value.title,
    description: value.description,
    required: value.required,
    format: value.valueFormat,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    'x-component': 'Input',
    ['x-component-props']: {
      placeholder: value.placeholder,
    },
    ['x-internal']: {
      sortable: value.sortable,
    },
  };
}

export default toSchema;
