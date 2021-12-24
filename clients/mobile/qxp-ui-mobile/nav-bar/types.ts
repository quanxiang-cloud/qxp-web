import React from 'react';

import { Props } from '..';

export interface NavBarProps extends Props {
  title?: React.ReactNode;
  fixed?: boolean;
  zIndex?: number | string;
  leftText?: React.ReactNode;
  rightText?: React.ReactNode;
  leftArrow?: boolean;
  safeAreaInsetTop?: boolean;
  placeholder?: boolean;
  onClickLeft?: (e: React.MouseEvent) => void;
  onClickRight?: (e: React.MouseEvent) => void;
}
