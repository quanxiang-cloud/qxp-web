import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Container from './container';
import { CardItem } from './type';

type Props = {
  list: CardItem[];
  onChange: (ids: string[]) => void;
}

export default function Sortable(props: Props): JSX.Element {
  return (
    <DndProvider backend={HTML5Backend}>
      <Container {...props} />
    </DndProvider>
  );
}
