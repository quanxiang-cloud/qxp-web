import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { CardItem } from './type';

type Props = {
  cardItem: CardItem;
  moveCard: (id: string, to: number) => void;
  findCard: (id: string) => { index: number };
  onEnd: () => void;
}

function CardContainer({
  cardItem,
  moveCard,
  findCard,
  onEnd,
}: Props): JSX.Element {
  const { id } = cardItem;
  const originalIndex = findCard(id).index;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'card',
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveCard(droppedId, originalIndex);
        } else {
          onEnd();
        }
      },
    }),
    [id, originalIndex, moveCard],
  );

  const [, drop] = useDrop(
    () => ({
      accept: 'card',
      canDrop: () => false,
      hover({ id: draggedId }: any) {
        if (draggedId !== id) {
          const { index: overIndex } = findCard(id);
          moveCard(draggedId, overIndex);
        }
      },
    }),
    [findCard, moveCard],
  );

  const opacity = isDragging ? 0 : 1;

  if (cardItem.forbidden) {
    return cardItem.render();
  }

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity }}>
      {cardItem.render()}
    </div>
  );
}

export default CardContainer;
