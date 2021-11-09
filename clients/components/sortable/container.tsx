import React, { useCallback, useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';

import Card from './card';
import { CardItem } from './type';

type Props = {
  list: CardItem[];
  onChange: (ids: string[]) => void;
}

function Sortable({ list = [], onChange }: Props): JSX.Element {
  const [cardsKeys, setCardsKeys] = useState<string[]>([]);
  const [cardsMap, setCardsMap] = useState<Record<string, CardItem>>({});

  useEffect(() => {
    const _cardsMap: Record<string, CardItem> = {};
    const keys = list.map((card) => {
      _cardsMap[card.id] = card;
      return card.id;
    });
    setCardsKeys(keys);
    setCardsMap(_cardsMap);
  }, [list]);

  function findCard(id: string) {
    const cardIndex = cardsKeys.findIndex((key) => key === id);
    return {
      card: cardsMap[id],
      index: cardIndex,
    };
  }

  const moveCard = useCallback(
    (id: string, atIndex: number) => {
      const { index } = findCard(id);
      const keysTmp = [...cardsKeys];
      keysTmp.splice(index, 1);
      keysTmp.splice(atIndex, 0, id);
      setCardsKeys(keysTmp);
    },
    [findCard],
  );

  const [, drop] = useDrop(() => ({ accept: 'card' }));

  return (
    <div ref={drop} >
      {cardsKeys.map((key) => {
        return (
          <Card
            key={key}
            cardItem={cardsMap[key]}
            findCard={findCard}
            moveCard={moveCard}
            onEnd={() => onChange(cardsKeys.filter((key) => !cardsMap[key].forbidden ))}
          />
        );
      })}
    </div>
  );
}

export default Sortable;
