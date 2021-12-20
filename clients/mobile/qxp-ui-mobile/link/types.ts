import { Props } from '@m/qxp-ui-mobile';
import { HTMLAttributeAnchorTarget } from 'react';

export interface LinkProps extends Props {
  useHistory?: boolean;
  href?: string;
  target?: HTMLAttributeAnchorTarget | '_history';
}
