import ColorPicker from './ColorPicker';
import AttrForm from './AttrForm';

export default {
  AttrForm,
  component: ColorPicker,
  config: {
    title: '颜色选择',
    icon: 'color-picker',
    key: 'ColorPicker',
    category: 'basic',
    order: 10,
    defaultProps: {
      label: '颜色选择',
    },
  },
};
