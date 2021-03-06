import withDragResize from '@lib/hoc/with-drag-resize';
import DrawerContent from '@c/drawer/content';

const PolyDrawerContent = withDragResize(
  DrawerContent,
  {
    position: 'left',
    className: 'absolute right-0 top-0 bottom-0 w-732 overflow-hidden transition-all duration-300',
    style: {
      borderBottomLeftRadius: 0,
      borderTopLeftRadius: 0,
    },
    minWidth: 732,
  },
);

export default PolyDrawerContent;
