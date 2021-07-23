export interface AssociatedDataConfig {
  title: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  appID: string;
  associationTableID: string;
  displayField: string;
  required: boolean;
  placeholder: string;
}

export const defaultConfig: AssociatedDataConfig = {
  title: '关联数据',
  placeholder: '选择关联数据',
  description: '',
  displayModifier: 'normal',
  associationTableID: '',
  appID: '',
  displayField: '',
  required: false,
};

export function toSchema(config: AssociatedDataConfig): ISchema {
  return {
    type: 'label-value',
    title: config.title,
    description: config.description,
    required: config.required,
    readOnly: config.displayModifier === 'readonly',
    display: config.displayModifier !== 'hidden',
    items: { type: 'string' },
    'x-component': 'AssociatedData',
    ['x-component-props']: {
      appID: config?.appID,
      displayField: config.displayField,
      associationTableID: config?.associationTableID,
      placeholder: config.placeholder,
    },
    ['x-internal']: {
      permission: 3,
    },
  };
}

export function toConfig(schema: ISchema): AssociatedDataConfig {
  let displayModifier: FormBuilder.DisplayModifier = 'normal';
  if (schema.readOnly) {
    displayModifier = 'readonly';
  } else if (!schema.display) {
    displayModifier = 'hidden';
  }

  return {
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: displayModifier,
    associationTableID: schema['x-component-props']?.associationTableID,
    displayField: schema['x-component-props']?.displayField,
    appID: schema['x-component-props']?.appID,
    placeholder: schema['x-component-props']?.placeholder || '选择关联数据',
    required: !!schema.required,
  };
}
