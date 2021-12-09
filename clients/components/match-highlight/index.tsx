import React, { CSSProperties } from 'react';

interface Props {
  text: string;
  match: string;
  style?: CSSProperties;
  className?: string;
}

export function MatchHighlight({
  text,
  match,
  style,
  className,
}: Props): JSX.Element {
  if (!match) {
    return <span>{text}</span>;
  }

  const textArray = text.split(match).join(`:::${match}:::`).split(':::').filter(Boolean)
    .map((content: string, i: number) => {
      return content === match ? (
        <span key={i} className={className} style={style}>
          {content}
        </span>
      ) : content;
    });

  return <>{textArray}</>;
}
