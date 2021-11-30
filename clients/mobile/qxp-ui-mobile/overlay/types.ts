import { Props } from '@m/qxp-ui-mobile';

export interface OverlayProps extends Props {
  visible?: boolean;
  zIndex?: number;
  duration?: number;
  lockScroll?: boolean;
}
