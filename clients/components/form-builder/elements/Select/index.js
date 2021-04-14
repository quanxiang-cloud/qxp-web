import Select from './Select';
import AttrForm from './AttrForm';

const defaultOptions = [
  {
    label: '选项一',
    value: 'value1',
  },
  {
    label: '选项二',
    value: 'value2',
  },
  {
    label: '选项三',
    value: 'value3',
  },
];

export default {
  AttrForm,
  component: Select,
  config: {
    title: '下拉选择框',
    icon: 'select',
    key: 'Select',
    category: 'basic',
    order: 5,
    defaultProps: {
      label: '下拉选择框',
      mode: 'single',
      placeholder: '请选择..',
      options: defaultOptions,
      optionType: 'static',
    },
  },
};
