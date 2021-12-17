import React, { CSSProperties, isValidElement, ReactNode, useState } from 'react';
import Button, { ButtonProps } from '@m/qxp-ui-mobile/button';
import Popup from '@m/qxp-ui-mobile/popup';
import { Props, VoidCallback } from '@m/qxp-ui-mobile';
import { PopupPosition } from '@m/qxp-ui-mobile/popup/types';
import { isPromise } from '@m/qxp-ui-mobile/utils';

type LoadingFunc = () => Promise<boolean>;

export const defaultPositiveButton: ButtonProps = {
  block: true, theme: 'tertiary', className: 'mb-8',
};

export const defaultNegativeButton: ButtonProps = {
  block: true, theme: 'textSecondary', className: 'mb-8', text: '取消',
};

export interface AlertDialogProps extends Props {
  title?: ReactNode;
  titleClassName?: string;
  titleStyle?: CSSProperties;
  positiveButton?: ButtonProps;
  onPositiveClick?: LoadingFunc | VoidCallback;
  negativeButton?: ButtonProps | boolean;
  onNegativeClick?: VoidCallback;
  position?: PopupPosition;
  applyDefaultStyle?: boolean;
  show: boolean;
  onClose: () => void;
}

export default function AlertDialog({
  title, positiveButton, onPositiveClick,
  negativeButton, onNegativeClick, className,
  style, titleClassName, position = 'bottom',
  children, applyDefaultStyle = true, titleStyle = {},
  show, onClose,
} : AlertDialogProps): JSX.Element {
  const [loading, setLoading] = useState(false);

  function onClick(): void {
    if (!onPositiveClick) return;
    setLoading(true);
    const result = onPositiveClick();
    if (isPromise(result)) {
      (result as Promise<boolean>).then((success) => {
        setLoading(false);
        if (success) onClose();
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
      onClose();
    }
  }

  function onNegClick(): void {
    onNegativeClick?.();
    onClose();
  }

  return (
    <Popup visible={show}
      round
      safeAreaInsetBottom={position === 'bottom'}
      lockScroll
      position={position}
      onClose={onClose}>
      <div className={`padding-12 ${className}`} style={style}>
        {typeof title === 'string' && (
          <h3 className={`title3 text-primary text-center ${titleClassName}`}
            style={{ paddingTop: '.04rem', paddingBottom: '.22rem', ...titleStyle }}>
            {title}
          </h3>
        )}

        {typeof title !== 'string' && isValidElement(title) && title}

        {children}

        {positiveButton && (
          <Button
            {...(applyDefaultStyle ? defaultPositiveButton : {})}
            {...positiveButton}
            loading={loading}
            onClick={onClick}>
            {positiveButton?.children}
          </Button>
        )}
        {typeof negativeButton === 'boolean' && negativeButton && (
          <Button
            {...(applyDefaultStyle ? defaultNegativeButton : {})}
            onClick={onNegClick}>
          </Button>
        )}
        {typeof negativeButton === 'object' && (
          <Button
            {...(applyDefaultStyle ? defaultNegativeButton : {})}
            {...negativeButton}
            onClick={onNegClick}>
            {negativeButton?.children}
          </Button>
        )}
      </div>
    </Popup>
  );
}
