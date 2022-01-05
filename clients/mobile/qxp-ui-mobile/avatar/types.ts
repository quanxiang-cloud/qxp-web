import { NumberString, Props } from '..';

export interface AvatarProps extends Props {
  name?: string;
  size?: NumberString;
}

export interface AvatarInfo {
  name: string;
  color: string;
}
