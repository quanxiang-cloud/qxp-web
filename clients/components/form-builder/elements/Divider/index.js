import Divider from './Divider';
import AttrForm from './AttrForm';

export default {
  AttrForm,
  component: Divider,
  config: {
    title: '分割线',
    icon: 'dividing-line',
    key: 'Divider',
    category: 'layout',
    order: 3,
    defaultProps: {
      plain: false,
    },
  },
};
