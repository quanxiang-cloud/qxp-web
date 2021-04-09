import ArrayTable from './ArrayTable';
// import { ArrayTable } from '@formily/antd-components';
import ArrayEdit from './ArrayEdit';
import AttrForm from './AttrForm';

export default {
  AttrForm,
  component: ArrayTable,
  editComponent: ArrayEdit,
  config: {
    title: '自增容器',
    icon: 'container',
    key: 'ArrayTable',
    category: 'advance',
    order: 1,
    defaultProps: {
      label: '标题',
      allowAdd: true,
      allowSort: true,
      allowRemove: true,
      arrayListMode: 'table',
    },
    isWrapper: true,
  },
};
