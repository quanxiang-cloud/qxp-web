import React from 'react';

import Card from '@c/card';

interface Props {
  left: () => JSX.Element | null;
  right: () => JSX.Element;
}

export default function Layout({ left: Left, right: Right }: Props): JSX.Element {
  return (
    <div
      className="grid flex-1 h-full overflow-hidden rounded-tl-8 rounded-tr-8"
      style={{
        gridTemplateColumns: '212fr 1140fr',
        boxShadow: 'inset -1px -1px 0px #E2E8F0',
      }}
    >
      <Card
        className="h-full overflow-hidden"
        style={{ borderRadius: '0px' }}
        contentClassName="flex flex-col h-full border-r overflow-hidden bg-gray-50"
      >
        <Left />
      </Card>
      <Card
        className="h-full overflow-hidden"
        style={{ borderRadius: '0px' }}
        contentClassName="flex flex-col h-full overflow-hidden"
      >
        <Right />
      </Card>
    </div>
  );
}
