import { Range } from '@formily/antd-components';
import AttrForm from './AttrForm';

export default {
  AttrForm,
  component: Range,
  config: {
    title: '滑块',
    icon: 'slider',
    key: 'Range',
    category: 'basic',
    order: 8,
    defaultProps: {
      label: '滑块',
      min: 0,
      max: 100,
    },
  },
};
