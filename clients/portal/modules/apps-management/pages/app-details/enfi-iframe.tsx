import React from 'react';

type Props = {
  url: string;
}

export default function EnfiIFrame({ url }: Props): JSX.Element {
  return (
    <iframe
      src={url}
      frameBorder="0"
      style={{ height: '100%', width: '100%' }}
    />
  );
}
