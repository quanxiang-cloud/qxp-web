import React from 'react';
import cs from 'classnames';

export interface ILoading {
  desc?: string | JSX.Element;
  className?: string;
}

function Loading({ desc = '加载中...', className }: ILoading): JSX.Element {
  return (
    <div
      className={cs(
        'w-full h-full flex flex-col items-center justify-center py-4',
        className,
      )}
    >
      <img src='/dist/images/loading.svg' alt="loading" style={{ width: 32, height: 32, marginBottom: 8 }} />
      <span>{desc}</span>
    </div>
  );
}

export default Loading;
