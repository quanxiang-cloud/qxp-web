import { CSSProperties, ReactElement, ReactNode } from 'react';

import { Props } from '..';

export type PageIndicatorProps = {
  total: number;
  current: number;
  style?: CSSProperties;
  className?: string;
} & Pick<SwiperProps, 'vertical'>;

export interface SwiperProps extends Props {
  initialSwipe?: number;
  touchable?: boolean;
  autoplay?: boolean | number;
  loop?: boolean;
  vertical?: boolean;
  duration?: number;
  onChange?: (index: number) => void;
  indicatorProps?: Pick<PageIndicatorProps, 'style' | 'className'>;
  indicator?: boolean | ((total: number, current: number) => ReactNode);
  slideSize?: number;
  trackOffset?: number;
  stuckAtBoundary?: boolean;
  children?: ReactElement | ReactElement[];
}

export type SwiperInstance = {
  activeIndex: number;
  swipeTo: (index: number) => void;
  swipeNext: () => void;
  swipePrev: () => void;
  lock: () => void;
  unlock: () => void;
};
