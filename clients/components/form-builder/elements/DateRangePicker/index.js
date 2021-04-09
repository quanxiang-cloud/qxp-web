import { DatePicker } from '@formily/antd-components';

// special case, its attrForm extends DatePicker.
export default {
  component: DatePicker.RangePicker,
  config: {
    title: '日期范围选择器',
    icon: 'calendar',
    key: 'DateRangePicker',
    category: 'basic',
    order: 5,
    display: false,
    defaultProps: {
      label: '日期范围选择器',
      // format: 'YYYY/MM/DD',
      picker: '',
    },
  },
};
