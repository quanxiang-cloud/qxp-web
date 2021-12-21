import React from 'react';
import { LoadingProps, LoadingType } from '@m/qxp-ui-mobile/loading/types';
import { getSizeStyle } from '@m/qxp-ui-mobile/utils/format/unit';
import cs from 'classnames';

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
  <img className='loading__circular' src='/dist/images/loading.svg' alt='loading'/>
);

const icons = (): Record<LoadingType, JSX.Element> => ({
  spinner: <SpinIcon />,
  circular: <CircularIcon />,
});

const Loading: React.FC<LoadingProps> = (props) => {
  const { className, type = 'circular', vertical, size = '.32rem', children, style } = props;

  const spinnerStyle = getSizeStyle(size, style);

  const renderText = (): JSX.Element | null => {
    if (children) {
      return (
        <span className='loading__text'>
          {children}
        </span>
      );
    }
    return null;
  };

  return (
    <div className={cs(className, 'loading', { 'loading--vertical': vertical })}>
      <span className={cs(`loading__spinner--${type} loading__${type}`)}
        style={spinnerStyle}>
        {icons()[type]}
      </span>
      {renderText()}
    </div>
  );
};

Loading.defaultProps = {
  type: 'circular',
  size: '.32rem',
};

export default Loading;
