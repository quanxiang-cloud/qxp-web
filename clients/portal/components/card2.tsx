import React from 'react';
import useCss from 'react-use/lib/useCss';
import { twCascade } from '@mariusmarais/tailwind-cascade';

import TextHeader from './text-header';

export interface Props {
  title: string | JSX.Element;
  desc?: string;
  action?: string | JSX.Element;
  content?: JSX.Element;
  className?: string;
  headerClassName?: string;
  children?: JSX.Element;
  headerActionClassName?: string;
  contentClassName?: string;
  style?: Record<string, string>;
  descClassName?: string;
  titleClassName?: string;
  itemTitleClassName?: string;
}

export default function Card({
  title,
  action,
  content,
  className,
  desc,
  children,
  headerClassName,
  headerActionClassName,
  contentClassName,
  style,
  descClassName,
  titleClassName,
  itemTitleClassName,
}: Props) {
  const classNames = useCss({
    'border-radius': '12px',
  });

  return (
    <div style={style} className={twCascade('bg-white-dot-6-5 mt-20', classNames, className)}>
      <TextHeader
        title={title}
        titleClassName={titleClassName}
        itemTitleClassName={itemTitleClassName}
        desc={desc}
        action={action}
        actionClassName={headerActionClassName}
        className={headerClassName}
        descClassName={descClassName}
      />
      {(content || children) && (
        <main className={twCascade('flex-1', contentClassName)}>{content || children}</main>
      )}
    </div>
  );
}
