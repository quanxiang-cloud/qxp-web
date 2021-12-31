import { NumberString, Props } from '..';

export interface IconProps extends Props {
  name: string;
  type?: string;
  size?: NumberString;
  clickable?: boolean;
  disabled?: boolean;
  addPrefix?: boolean;
}
