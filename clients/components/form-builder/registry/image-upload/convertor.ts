import { getSchemaPermissionFromSchemaConfig, getDisplayModifierFromSchema } from '@c/form-builder/utils';

export interface ImageUploadConfig {
  title: string;
  type: string;
  description?: string;
  displayModifier: FormBuilder.DisplayModifier;
  required?: boolean;
  multiple?: boolean;
  autoCompress?: boolean; // todo
}

export const defaultConfig: ImageUploadConfig = {
  title: '图片',
  type: 'array',
  description: '',
  displayModifier: 'normal',
  required: false,
  multiple: true,
  autoCompress: false,
};

export function toSchema(value: ImageUploadConfig): ISchema {
  return {
    type: 'array',
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
      permission: getSchemaPermissionFromSchemaConfig(value),
    },
  };
}

export function toConfig(schema: ISchema): ImageUploadConfig {
  return {
    title: schema.title as string,
    type: 'array',
    description: schema.description as string,
    displayModifier: getDisplayModifierFromSchema(schema),
    required: !!schema.required,
    multiple: schema['x-component-props']?.multiple,
    autoCompress: schema['x-component-props']?.autoCompress,
  };
}
