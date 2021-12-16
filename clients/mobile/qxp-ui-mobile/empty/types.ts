import { NumberString, Props } from '@m/qxp-ui-mobile';
import { IconProps } from '@m/qxp-ui-mobile/icon/types';

export interface EmptyProps extends Props {
  icon?: IconProps;
  image?: string;
  title?: string;
  content?: string;
}

export interface EmptyImageProps extends Props {
  src: string;
  size?: NumberString;
}
