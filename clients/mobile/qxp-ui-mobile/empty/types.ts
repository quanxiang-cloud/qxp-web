import { Props } from '@m/qxp-ui-mobile';
import { IconProps } from '@m/qxp-ui-mobile/icon/types';

export interface EmptyProps extends Props {
  icon?: IconProps;
  image?: JSX.Element;
  title?: string;
  content?: string;
}

export interface EmptyImageProps extends Props {
  src: string;
  size?: string | number;
}
