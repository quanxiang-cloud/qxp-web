import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  content: string;
}

export default function Div({ content, children, ...props }: Props): JSX.Element {
  return <div {...props}>{content || children}</div>;
}
