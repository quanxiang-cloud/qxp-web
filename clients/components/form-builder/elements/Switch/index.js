import { Switch } from '@formily/antd-components';
import AttrForm from './AttrForm';

export default {
  AttrForm,
  component: Switch,
  config: {
    title: '开关',
    icon: 'switch',
    key: 'Switch',
    category: 'basic',
    order: 8,
    defaultProps: {
      label: '开关',
    },
  },
};
