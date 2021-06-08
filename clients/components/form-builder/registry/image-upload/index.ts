import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, ImageUploadConfig } from './convertor';
import Uploader from './uploader';
import FileList from '@portal/modules/system-mgmt/send-message/filelist';

const Field: Omit<FormBuilder.SourceElement<ImageUploadConfig>, 'displayOrder'> = {
  configSchema,
  displayName: '图片',
  icon: 'image',
  defaultConfig: defaultConfig,
  toSchema,
  toConfig,
  component: Uploader,
  category: 'advance',
  componentName: 'ImageUpload',
  configDependencies: { FileList },
};

export default Field;
