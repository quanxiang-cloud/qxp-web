import React from 'react';
import cs from 'classnames';

import { getSizeStyle } from '../utils/format/unit';

import { LoadingProps, LoadingType } from './types';

const SpinIcon = (): JSX.Element => (
  <>
    {Array(12)
      .fill(null)
      .map((_, index) => (
        <i key={index} className={`loading__line loading__line--${(index + 1)}`} />
      ))}
  </>
);

const CircularIcon = (): JSX.Element => (
  <img className='loading__circular--img' src='/dist/images/loading.svg' alt='loading'/>
);

const icons = (): Record<LoadingType, JSX.Element> => ({
  spinner: <SpinIcon />,
  circular: <CircularIcon />,
});

const Loading: React.FC<LoadingProps> = (props) => {
  const {
    className,
    type = 'circular',
    vertical,
    children,
    size = children ? '.18rem' : '.32rem',
    style,
  } = props;

  const spinnerStyle = getSizeStyle(size, style);

  const renderText = (): JSX.Element | null => {
    if (children) {
      return (
        <span className='loading__text text-placeholder'>
          {children}
        </span>
      );
    }
    return null;
  };

  return (
    <div className={cs(className, 'loading', { 'loading--vertical': vertical })}
      style={props.style}>
      <span className={cs(`loading__spinner--${type} loading__${type}`)}
        style={spinnerStyle}>
        {icons()[type]}
      </span>
      {renderText()}
    </div>
  );
};

export default Loading;
