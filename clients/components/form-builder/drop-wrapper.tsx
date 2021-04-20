import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import classNames from 'classnames';
import Icon from '@c/icon';
import { useFormBuilderContext } from './context';

type Props = React.PropsWithChildren<{
  isWrapper: boolean;
  innerWrapper?: boolean;
  className: string;
  id: string;
  style?: React.CSSProperties;
  item: Record<string, unknown>;
  path: string;
  index: number;
  draggable: boolean;
}>;

export default function DndWrapper({
  id,
  item,
  innerWrapper = false,
  children,
  style,
  className,
  index,
}: Props) {
  const [dropPosition] = useState('');
  const [isHover, setIsHover] = useState(false);
  const {
    deleteItem,
    duplicateItem,
    setCurrentActiveItem,
    activeItem,
  } = useFormBuilderContext();

  const [{ canDrop, isOver }, dropRef] = useDrop<any, DropResult, any>({
    accept: 'SOURCE_ELEMENT',
    drop: (_, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        // console.log('already dropped');
        return;
      }

      // console.log('return drop result');
      // eslint-disable-next-line consistent-return
      return { id, item, index, dropPosition };
    },
    // hover: (dropItem, monitor) => {
    //   const didHover = monitor.isOver({ shallow: true });
    //   setDropPosition('inside');
    //   // if (didHover && dropRef.current) {
    //   //   const hoverBoundingRect = dropRef.current.getBoundingClientRect();
    //   //   const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    //   //   const dragOffset = monitor.getSourceClientOffset();
    //   //   // todo refactor this
    //   //   const hoverClientY = (dragOffset?.y || 0) - hoverBoundingRect.top;

    //   //   if (isWrapper) {
    //   //     // console.log('set drop position')
    //   //   } else {
    //   //     if (hoverClientY <= hoverMiddleY) {
    //   //       setDropPosition('up');
    //   //     }
    //   //     if (hoverClientY > hoverMiddleY) {
    //   //       setDropPosition('down');
    //   //     }
    //   //   }
    //   // }
    // },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleClickItem: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    if (item.id === '$0') {
      setCurrentActiveItem?.(null);
    } else {
      setCurrentActiveItem?.(item);
    }
  };

  const toggleItemHover = (value: boolean) => {
    if (value !== isHover) {
      setIsHover(value);
    }
  };

  const handleDeleteItem: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    setCurrentActiveItem?.(null);
    deleteItem?.(item, index);
  };

  const handleDuplicateItem: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    duplicateItem?.(item, index);
  };
  const isActive = canDrop && isOver;

  return (
    <div
      ref={dropRef}
      className={classNames(className, {
        canDrop: isActive,
        [`drop-class-${dropPosition}`]: isActive,
        'mouse-hover': isHover,
        'is-active': activeItem && id === activeItem.id,
        'inner-wrapper': innerWrapper,
      })}
      style={style}
      onClick={handleClickItem}
      onMouseOver={(event) => {
        event.stopPropagation();
        toggleItemHover(true);
      }}
      onMouseOut={(event) => {
        event.stopPropagation();
        toggleItemHover(false);
      }}
    >
      {children}
      {innerWrapper || id === '$0' ? null : (
        <>
          {/* <div className="drag-handler" ref={dragRef}>
            <Icon name="drag-handle" />
          </div> */}
          <div className="btn-copy" onClick={handleDuplicateItem}>
            <Icon name="copy" type="dark" />
          </div>
          <div className="btn-trash" onClick={handleDeleteItem}>
            <Icon name="trash" type="dark" />
          </div>
        </>
      )}
    </div>
  );
}
