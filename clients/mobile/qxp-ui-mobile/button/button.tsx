import React, { isValidElement } from 'react';
import { ButtonProps } from './types';
import cs from 'classnames';
import Loading from '@m/qxp-ui-mobile/loading';
import Icon from '@m/qxp-ui-mobile/icon';

const Button: React.FC<ButtonProps> = (props) => {
  const {
    className,
    theme = 'primary',
    disabled,
    disabledTextColor = 'var(--gray-600)',
    loading,
    loadingText,
    block,
    icon,
    iconSize = '.2rem',
    iconPosition = 'left',
    iconClassName,
  } = props;

  function onClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    if (!loading && !disabled && props.onClick) {
      props.onClick(event);
    }
  }

  const renderLoadingIcon = (): React.ReactNode => {
    if (loading) {
      const { loadingType } = props;
      return (
        <Loading
          className={`button--loading__loading ${iconClassName}`}
          size={iconSize}
          type={loadingType}
        />
      );
    }
    return null;
  };

  const renderIcon = (): React.ReactNode => {
    if (loading) {
      return renderLoadingIcon();
    }

    if (typeof icon === 'string') {
      return <Icon name={icon} size={iconSize} className={iconClassName} />;
    }

    if (isValidElement(icon)) {
      return icon;
    }

    return null;
  };

  const renderText = (): React.ReactNode => {
    let text;
    if (loading) {
      text = loadingText;
    } else {
      text = props.children || props.text;
    }

    if (text) {
      return (
        <p key="text" className='ml-8 mr-8 truncate'
          style={(disabled || loading) && theme !== 'primary' ? { color: disabledTextColor } : undefined}>
          {text}
        </p>
      );
    }
    return null;
  };

  const renderContent = (): React.ReactNode => (
    <div className='flex items-center justify-center'>
      {iconPosition === 'left' && renderIcon()}
      {renderText()}
      {iconPosition === 'right' && renderIcon()}
    </div>
  );

  return (
    <button onClick={onClick}
      style={props.style}
      className={cs(className, 'button', `button--${theme}`, {
        'button--disabled': disabled,
        'button--loading': loading,
        'button--block': block,
      })}>
      {renderContent()}
    </button>
  );
};

export default Button;
