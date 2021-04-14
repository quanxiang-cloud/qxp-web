import DatePicker from './DatePicker';
import AttrForm from './AttrForm';

export default {
  AttrForm,
  component: DatePicker,
  config: {
    title: '日期选择器',
    icon: 'calendar',
    key: 'DatePicker',
    category: 'basic',
    order: 6,
    defaultProps: {
      label: '日期选择器',
      picker: '',
    },
  },
};
