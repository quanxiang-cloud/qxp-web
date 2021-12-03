import React, { PropsWithChildren } from 'react';
import useCss from 'react-use/lib/useCss';
import cs from 'classnames';

import TextHeader from './text-header';

export type Props = PropsWithChildren<{
  title?: string | JSX.Element;
  desc?: string;
  action?: string | JSX.Element;
  content?: JSX.Element;
  className?: string;
  headerClassName?: string;
  headerActionClassName?: string;
  contentClassName?: string;
  style?: Record<string, string>;
  descClassName?: string;
  titleClassName?: string;
  itemTitleClassName?: string;
}>;

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
}: Props): JSX.Element {
  const classNames = useCss({
    'border-radius': '12px',
  });

  return (
    <div style={style} className={cs('bg-white', classNames, className)}>
      {title && (
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
      )}
      {(content || children) && (
        <main className={cs('flex flex-grow', contentClassName)}>
          {content || children}
        </main>
      )}
    </div>
  );
}
