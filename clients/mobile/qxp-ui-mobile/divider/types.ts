import { Props } from '..';

export interface DividerProps extends Props {
  color?: string;
  direction?: 'horizontal' | 'vertical';
  size?: string | number;
  thickness?: string | number;
}
