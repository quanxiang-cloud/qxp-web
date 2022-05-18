import React, { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLImageElement>

export default function Img(props: Props): JSX.Element {
  return <img {...props} />;
}
