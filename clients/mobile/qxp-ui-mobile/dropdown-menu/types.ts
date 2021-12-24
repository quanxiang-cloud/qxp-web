import { CSSProperties, ReactNode } from 'react';

import { NumberString, Props, TeleportType } from '..';
import { Direction } from '../list/types';

export interface DropdownMenuOption {
  label: string;
  value: NumberString;
}

export interface DropdownMenuProps extends Props {
  value?: NumberString;
  options?: DropdownMenuOption[];
  overlay?: boolean;
  zIndex?: NumberString;
  duration?: NumberString;
  direction?: Direction;
  closeOnClickOverlay?: boolean;
  overlayStyle?: CSSProperties;
  popupStyle?: CSSProperties;
  onClose?: () => void;
  onOpen?: () => void;
  onOpened?: () => void;
  onClosed?: () => void;
  onChange?: (label: string, value: NumberString) => void;
  teleport?: TeleportType;
  renderOption?: (option: DropdownMenuOption, active: boolean) => ReactNode;
  showPopup?: boolean;
  offset?: NumberString;
}

export type DropdownMenuInstance = {
  toggle: (show?: boolean, options?: { immediate?: boolean }) => void;
  state: {
    transition: boolean;
    showWrapper: boolean;
    showPopup: boolean;
    value: NumberString;
  };
};
