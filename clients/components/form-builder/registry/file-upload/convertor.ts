export interface FileUploadConfig {
  title: string;
  description?: string;
  displayModifier?: FormBuilder.DisplayModifier;
  required?: boolean;
  multiple?: boolean;
}

export const defaultConfig: FileUploadConfig = {
  title: '附件',
  description: '',
  displayModifier: 'normal',
  required: false,
  multiple: true,
};

export function toSchema(value: FileUploadConfig): ISchema {
  return {
    type: 'array',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    'x-component': 'FileUpload',
    ['x-component-props']: {
      multiple: value.multiple,
    },
    ['x-internal']: {
      permission: 3,
    },
  };
}

export function toConfig(schema: ISchema): FileUploadConfig {
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
    required: !!schema.required,
    multiple: schema['x-component-props']?.multiple,
  };
}
