import { HTMLAttributeAnchorTarget } from 'react';

import { Props } from '..';

export interface LinkProps extends Props {
  useHistory?: boolean;
  href?: string;
  target?: HTMLAttributeAnchorTarget | '_history';
}
