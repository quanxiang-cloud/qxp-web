import { Password } from '@formily/antd-components';
import AttrForm from './AttrForm';

export default {
  AttrForm,
  component: Password,
  config: {
    title: '密码输入框',
    icon: 'key',
    key: 'Password',
    category: 'basic',
    order: 3,
    defaultProps: {
      label: '密码',
      placeholder: '请输入...',
    },
  },
};
