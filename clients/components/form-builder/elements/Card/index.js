import AttrForm from './AttrForm';
import CardEdit from './CardEdit';

export default {
  AttrForm,
  editComponent: CardEdit,
  config: {
    title: '卡片',
    icon: 'container',
    key: 'Card',
    category: 'layout',
    order: 1,
    defaultProps: {
      title: '卡片',
      size: 'small',
      // children: [],
    },
    isWrapper: true,
  },
};
