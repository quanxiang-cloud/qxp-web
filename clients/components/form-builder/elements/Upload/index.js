import { Upload } from '@formily/antd-components';
import AttrForm from './AttrForm';

export default {
  AttrForm,
  component: Upload,
  config: {
    title: '文件上传',
    icon: 'upload',
    key: 'Upload',
    category: 'advance',
    order: 2,
    defaultProps: {
      label: '文件上传',
      listType: 'card',
    },
  },
};
