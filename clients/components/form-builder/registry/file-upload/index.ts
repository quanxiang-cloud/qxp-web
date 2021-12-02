import FileList from '@c/file-upload/file-list';
import FormFileUploader from './uploader';
import { validateRegistryElement } from '@c/form-builder/utils';

import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, FileUploadConfig } from './convertor';

const Field: Omit<FormBuilder.SourceElement<FileUploadConfig>, 'displayOrder'> = {
  configSchema,
  displayName: '附件',
  icon: 'upload_file',
  defaultConfig: defaultConfig,
  toSchema,
  toConfig,
  component: FormFileUploader,
  category: 'advance',
  componentName: 'FileUpload',
  configDependencies: { FileList },
  validate: validateRegistryElement(configSchema),
};

export default Field;
