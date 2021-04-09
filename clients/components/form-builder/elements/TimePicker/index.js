import { TimePicker } from '@formily/antd-components';
import AttrForm from './AttrForm';

export default {
  AttrForm,
  component: TimePicker,
  config: {
    title: '时间选择器',
    icon: 'clock',
    key: 'TimePicker',
    category: 'basic',
    order: 7,
    defaultProps: {
      label: '时间选择器',
      format: 'HH:mm:ss',
    },
  },
};
