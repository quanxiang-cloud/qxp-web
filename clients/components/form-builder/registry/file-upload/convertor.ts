import { getSchemaPermissionFromSchemaConfig, getDisplayModifierFromSchema } from '@c/form-builder/utils';

export interface FileUploadConfig {
  title: string;
  maxFileSize: number;
  uploaderDescription: string;
  displayModifier: FormBuilder.DisplayModifier;
  multiple?: boolean;
  required?: boolean;
  description?: string;
}

export const defaultConfig: FileUploadConfig = {
  title: '附件',
  description: '',
  displayModifier: 'normal',
  required: false,
  multiple: true,
  maxFileSize: 500,
  uploaderDescription: '',
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
      maxFileSize: value.maxFileSize || defaultConfig.maxFileSize,
      uploaderDescription: value.uploaderDescription?.substring(0, 30) || '',
    },
    ['x-internal']: {
      permission: getSchemaPermissionFromSchemaConfig(value),
    },
  };
}

export function toConfig(schema: ISchema): FileUploadConfig {
  return {
    title: schema.title as string,
    description: schema.description as string,
    displayModifier: getDisplayModifierFromSchema(schema),
    required: !!schema.required,
    multiple: schema['x-component-props']?.multiple,
    maxFileSize: schema['x-component-props']?.maxFileSize || defaultConfig.maxFileSize,
    uploaderDescription: schema['x-component-props']?.uploaderDescription,
  };
}
