import ArrayCards from './ArrayCards';

export default {
  component: ArrayCards,
  config: {
    title: '自增容器',
    icon: 'container',
    key: 'ArrayCards',
    category: 'advance',
    order: 1,
    display: false,
    defaultProps: {
      label: '标题',
    },
    isWrapper: true,
  },
};
