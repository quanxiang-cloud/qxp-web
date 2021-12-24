import { Props } from '..';

export type LoadingType = 'circular' | 'spinner';

export interface LoadingProps extends Props {
  size?: string | number;
  vertical?: boolean;
  type?: LoadingType;
}
