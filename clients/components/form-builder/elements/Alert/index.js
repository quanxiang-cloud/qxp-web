import { Alert } from 'antd';
import AttrForm from './AttrForm';

export default {
  AttrForm,
  component: Alert,
  config: {
    title: '文本提示框',
    icon: 'container',
    key: 'Alert',
    category: 'advance',
    order: 1,
    defaultProps: {
      message: '信息标题',
      description: '信息描述',
      type: 'info',
      showIcon: true,
    },
  },
};
