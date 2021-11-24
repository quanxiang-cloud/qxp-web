import { getSchemaPermissionFromSchemaConfig, getDisplayModifierFromSchema } from '@c/form-builder/utils';

export interface ImageUploadConfig {
  title: string;
  type: string;
  maxFileSize: number;
  uploaderDescription: string;
  displayModifier: FormBuilder.DisplayModifier;
  description?: string;
  required?: boolean;
  multiple?: boolean;
}

export const defaultConfig: ImageUploadConfig = {
  title: '图片',
  type: 'array',
  description: '',
  displayModifier: 'normal',
  required: false,
  multiple: true,
  uploaderDescription: '上传图片',
  maxFileSize: 500,
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
      fileType: 'image',
      maxFileSize: value.maxFileSize || defaultConfig.maxFileSize,
      uploaderDescription: value.uploaderDescription?.substring(0, 4) || '',
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
    maxFileSize: schema['x-component-props']?.maxFileSize || defaultConfig.maxFileSize,
    uploaderDescription: schema['x-component-props']?.uploaderDescription,
  };
}
