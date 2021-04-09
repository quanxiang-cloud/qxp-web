import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import classNames from 'classnames';
import Icon from '@c/icon';
import { useFormBuilderContext } from './context';

type Props = {
  isWrapper: boolean;
  innerWrapper?: boolean;
  className: string;
  id: string;
  style?: React.CSSProperties;
  item: Record<string, unknown>;
  path: string;
  index: number;
  draggable: boolean;
  children: React.ReactChild;
}

type DragObject = {
  id: string;
  path: string;
  item: Record<string, unknown>;
  index?: number;
  isWrapper: boolean;
}

type DropResult = {
  id: string;
  index: number;
  path: string;
  dropPosition: string;
}

type CollectedProps = {
  isDragging: boolean;
}

export default function DndWrapper({
  id,
  item,
  isWrapper = false,
  innerWrapper = false,
  draggable = true,
  children,
  style,
  className,
  path,
  index,
}: Props) {
  const [dropPosition] = useState('');
  const [isHover, setIsHover] = useState(false);
  const {
    updateData,
    deleteItem,
    duplicateItem,
    setCurrentActiveItem,
    activeItem,
  } = useFormBuilderContext();
  const [{ isDragging }, dragRef] = useDrag<DragObject, DropResult, CollectedProps>({
    type: 'SOURCE_ELEMENT',
    item: { id, path, item, index, isWrapper },
    canDrag: () => draggable,
    end: (dragItem, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dragItem && dropResult) {
        const targetItem = { id: dropResult.id, index: dropResult.index, path: dropResult.path };
        const sourceItem = { item: dragItem.item, index: dragItem.index, path: dragItem.path };
        updateData(sourceItem, targetItem, dropResult.dropPosition);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // const [{ canDrop, isOver }, dropRef] = useDrop({
  //   accept: 'SOURCE_ELEMENT',
  //   drop: (_, monitor) => {
  //     const didDrop = monitor.didDrop();
  //     // console.log('did drop', didDrop)
  //     if (didDrop) return;
  //     // console.log('return drop')
  //     // eslint-disable-next-line consistent-return
  //     return { id, item, index, path, dropPosition };
  //   },
  //   hover: (dropItem, monitor) => {
  //     const didHover = monitor.isOver({ shallow: true });
  //     if (didHover && boxRef.current) {
  //       const hoverBoundingRect = boxRef.current.getBoundingClientRect();
  //       const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
  //       const dragOffset = monitor.getSourceClientOffset();
  //       // todo refactor this
  //       const hoverClientY = (dragOffset?.y || 0) - hoverBoundingRect.top;

  //       if (isWrapper) {
  //         setDropPosition('inside');
  //       } else {
  //         if (hoverClientY <= hoverMiddleY) {
  //           setDropPosition('up');
  //         }
  //         if (hoverClientY > hoverMiddleY) {
  //           setDropPosition('down');
  //         }
  //       }
  //     }
  //   },
  //   collect: (monitor) => ({
  //     isOver: monitor.isOver({ shallow: true }),
  //     canDrop: monitor.canDrop(),
  //   }),
  // });

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

  const isActive = !isDragging;
  // dragPreview(dropRef(boxRef));

  return (
    <div
      // ref={boxRef}
      ref={dragRef}
      className={classNames(className, {
        canDrop: isActive,
        isDragging,
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
