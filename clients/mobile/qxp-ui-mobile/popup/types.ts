import React, { CSSProperties } from 'react';
import { NumberString, Props, TeleportType } from '@m/qxp-ui-mobile';

export type PopupPosition = 'top' | 'left' | 'bottom' | 'right' | 'center' | '';

export type PopupCloseIconPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type Position = 'center' | 'top' | 'bottom' | 'right' | 'left';

export interface SharedPopupProps extends Props {
  round?: boolean;
  zIndex?: number;
  overlay?: boolean;
  overlayClass?: string;
  overlayStyle?: CSSProperties;
  destroyOnClose?: boolean;
  forceRender?: boolean;
  lockScroll?: boolean;
  duration?: number;
  transition?: string;
  safeAreaInsetBottom?: boolean;
  closeOnClickOverlay?: boolean;
  closeOnPopstate?: boolean;
  onClickOverlay?: (e: React.MouseEvent) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onOpened?: () => void;
  onClosed?: () => void;
  beforeClose?: (action: string | number) => boolean | Promise<boolean>;
  teleport?: TeleportType;
}

export interface PopupProps extends SharedPopupProps {
  title?: string | React.ReactNode;
  visible?: boolean;
  closeIcon?: string;
  position?: PopupPosition;
  closeIconSize?: NumberString;
  closeIconPosition?: string;
  onClickCloseIcon?: (e: React.MouseEvent) => void;
}

export type PopupInstanceType = {
  popupRef: React.MutableRefObject<HTMLDivElement>;
};
