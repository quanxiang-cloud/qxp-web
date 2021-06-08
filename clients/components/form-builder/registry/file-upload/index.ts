import configSchema from './config-schema';
import { defaultConfig, toSchema, toConfig, FileUploadConfig } from './convertor';
import Uploader from './uploader';
import FileList from '@portal/modules/system-mgmt/send-message/filelist';

const Field: Omit<FormBuilder.SourceElement<FileUploadConfig>, 'displayOrder'> = {
  configSchema,
  displayName: '附件',
  icon: 'upload_file',
  defaultConfig: defaultConfig,
  toSchema,
  toConfig,
  component: Uploader,
  category: 'advance',
  componentName: 'FileUpload',
  configDependencies: { FileList },
};

export default Field;
