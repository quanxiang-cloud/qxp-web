import { Props } from '..';

export interface OverlayProps extends Props {
  visible?: boolean;
  zIndex?: number;
  duration?: number;
  lockScroll?: boolean;
}
