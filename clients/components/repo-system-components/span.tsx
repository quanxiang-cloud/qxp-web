import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  content: string;
}

export default function Span({ content, children, ...props }: Props): JSX.Element {
  return <span {...props}>{content || children}</span>;
}
