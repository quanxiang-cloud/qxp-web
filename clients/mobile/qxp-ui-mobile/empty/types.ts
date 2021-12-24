import { NumberString, Props } from '..';
import { IconProps } from '../icon/types';

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
