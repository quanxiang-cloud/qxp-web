import React from 'react';

import Card from '@c/card';

interface Props {
  left: () => JSX.Element;
  right: () => JSX.Element;
}

export default function Layout({ left: Left, right: Right }: Props): JSX.Element {
  return (
    <div
      className="grid flex-1 h-full overflow-hidden"
      style={{ gridTemplateColumns: 'minmax(200px, 25%) 1fr' }}
    >
      <Card
        className="h-full overflow-hidden"
        style={{ borderRadius: '0px' }}
        contentClassName="flex-col h-full border-r overflow-hidden"
      >
        <Left />
      </Card>
      <Card
        className="h-full overflow-hidden"
        style={{ borderRadius: '0px' }}
        contentClassName="flex-col h-full overflow-hidden"
      >
        <Right />
      </Card>
    </div>
  );
}
