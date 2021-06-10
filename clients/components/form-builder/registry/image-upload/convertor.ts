export interface ImageUploadConfig {
  title: string;
  description?: string;
  displayModifier?: FormBuilder.DisplayModifier;
  required?: boolean;
  multiple?: boolean;
  autoCompress?: boolean; // todo
}

export const defaultConfig: ImageUploadConfig = {
  title: '图片',
  description: '',
  displayModifier: 'normal',
  required: false,
  multiple: true,
  autoCompress: false,
};

export function toSchema(value: ImageUploadConfig): ISchema {
  return {
    type: 'string',
    title: value.title,
    description: value.description,
    required: value.required,
    readOnly: value.displayModifier === 'readonly',
    display: value.displayModifier !== 'hidden',
    'x-component': 'ImageUpload',
    ['x-component-props']: {
      multiple: value.multiple,
      autoCompress: value.autoCompress || false,
    },
    ['x-internal']: {
      permission: 3,
    },
  };
}

export function toConfig(schema: ISchema): ImageUploadConfig {
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
    autoCompress: schema['x-component-props']?.autoCompress,
  };
}
