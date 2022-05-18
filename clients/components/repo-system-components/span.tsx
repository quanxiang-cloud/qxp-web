import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  content: string;
}

export default function Img({ content, ...props }: Props): JSX.Element {
  return <span {...props}>{content}</span>;
}
