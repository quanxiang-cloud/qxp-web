import { Rating } from '@formily/antd-components';
import AttrForm from './AttrForm';

export default {
  AttrForm,
  component: Rating,
  config: {
    title: '评分',
    icon: 'star',
    key: 'Rating',
    category: 'basic',
    order: 9,
    defaultProps: {
      label: '评分',
      count: 5,
    },
  },
};
