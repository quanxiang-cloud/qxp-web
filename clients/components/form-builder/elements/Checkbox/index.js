import Checkbox from './Checkbox';
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
  component: Checkbox,
  config: {
    title: '多选框',
    icon: 'checkbox-group',
    key: 'Checkbox',
    category: 'basic',
    order: 5,
    defaultProps: {
      label: '多选框组',
      options: defaultOptions,
      optionType: 'static',
    },
  },
};
