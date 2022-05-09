import FileUpload from './file-upload';
import type { SourceElement } from '../../../types';

import ConfigForm, { DEFAULT_CONFIG } from './config-form';

type Props = {
  placeholder: string,
  rows: number,
  cols: number,
  name: string,
}

const elem: SourceElement<Props> = {
  name: 'FileUpload',
  icon: 'file_upload',
  label: '文件上传',
  category: 'systemComponents',
  component: FileUpload,
  configForm: ConfigForm,
  defaultConfig: DEFAULT_CONFIG,
  order: 2,
  defaultStyle: {
    display: 'inline-block',
  },
  exportActions: ['onFileSuccess'],
};

export default elem;
