import React from 'react';
import cs from 'classnames';

export type Props = {
  title?: string;
  style?: React.CSSProperties;
  className?: string;
  onResetValue?: () => void;
}

function StyleSubTitle({ style, className, title, onResetValue }: Props): JSX.Element {
  return (
    <div style={style} className={cs('flex justify-between items-center', {
      'flex-row-reverse': !title,
    }, className)}>
      {title && (<span className='text-12 text-gray-500'>{title}</span>)}
      {
        onResetValue && (
          <button
            className='px-4 py-2 rounded-4 border-1 border-blue-600 cursor-pointer text-blue-600 hover:bg-blue-600 hover:text-white'
            onClick={onResetValue}
          >重置</button>
        )
      }
    </div>
  );
}

export default StyleSubTitle;
