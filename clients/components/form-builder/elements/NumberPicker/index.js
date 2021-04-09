import { NumberPicker } from '@formily/antd-components';
import AttrForm from './AttrForm';

export default {
  AttrForm,
  component: NumberPicker,
  config: {
    title: '计数器',
    icon: 'counter',
    key: 'NumberPicker',
    category: 'basic',
    order: 4,
    defaultProps: {
      label: '计数器',
      min: 0,
      step: 1,
      initialValue: 1,
    },
  },
};
