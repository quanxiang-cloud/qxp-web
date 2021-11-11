import { validateRegistryElement } from '@c/form-builder/utils';
import FileList from '@c/file-upload/file-list'
;
import FormImgUploader from './uploader';

import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig } from './convertor';

const Field: Omit<FormBuilder.SourceElement<typeof defaultConfig>, 'displayOrder'> = {
  configSchema,
  displayName: '图片',
  icon: 'image',
  defaultConfig,
  toSchema,
  toConfig,
  component: FormImgUploader,
  category: 'advance',
  componentName: 'ImageUpload',
  configDependencies: { FileList },
  validate: validateRegistryElement(configSchema),
};

export default Field;
