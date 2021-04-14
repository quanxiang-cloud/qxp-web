import TreeSelect from './TreeSelect';
import AttrForm from './AttrForm';

export default {
  AttrForm,
  component: TreeSelect,
  config: {
    title: '树形选择器',
    icon: 'cascade-selection',
    key: 'TreeSelect',
    category: 'basic',
    order: 120,
    defaultProps: {
      label: '树形选择',
      optionType: 'static',
      placeholder: '请选择',
    },
  },
};
