import { TimePicker } from '@formily/antd-components';

// special case, its attrForm extends TimePicker.
export default {
  component: TimePicker.RangePicker,
  config: {
    title: '时间范围选择器',
    icon: 'clock',
    key: 'TimeRangePicker',
    category: 'basic',
    order: 5,
    display: false,
    defaultProps: {
      label: '时间范围选择器',
      format: 'HH:mm:ss',
    },
  },
};
