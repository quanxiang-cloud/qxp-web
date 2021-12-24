import React from 'react';

import { Props } from '..';

export type ScrollEventParams = {
  scrollTop: number;
  isFixed: boolean;
};

export type StickyPosition = 'top' | 'bottom';

export interface StickyProps extends Props {
  zIndex?: number | string;
  position?: StickyPosition;
  container?: React.MutableRefObject<HTMLElement>;
  offsetTop?: number | string;
  offsetBottom?: number | string;
  onScroll?: (e: ScrollEventParams) => void;
  onChange?: (isFixed: boolean) => void;
}
