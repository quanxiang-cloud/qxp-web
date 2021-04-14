import { FormMegaLayout } from '@formily/antd-components';
import AttrForm from './AttrForm';
import MegaLayoutEdit from './MegaLayoutEdit';

export default {
  AttrForm,
  component: FormMegaLayout,
  editComponent: MegaLayoutEdit,
  config: {
    title: 'Mega 布局',
    icon: 'grid-layout',
    key: 'MegaLayout',
    category: 'layout',
    order: 2,
    defaultProps: {},
    isWrapper: true,
  },
};
