import React from 'react';
import cs from 'classnames';

export type Props = {
  title?: string;
  style?: React.CSSProperties;
  className?: string;
  titleClassName?: string;
  onResetValue?: () => void;
}

function StyleSubTitle({ style, className, title, onResetValue, titleClassName }: Props): JSX.Element {
  return (
    <div style={style} className={cs('flex justify-between items-center', {
      'flex-row-reverse': !title,
    }, className)}>
      {title && (<span className={cs('text-12 text-gray-500', titleClassName)}>{title}</span>)}
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
