import React, { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLAnchorElement> {
  content: string;
}

export default function Img({ content, ...props }: Props): JSX.Element {
  return <a {...props}>{content}</a>;
}
