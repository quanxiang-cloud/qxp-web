import { NumberString, Props, RenderFunc } from '..';
import { LoadingType } from '../loading';

export type ButtonTheme =
  'primary' | 'secondary' | 'tertiary' |
  'danger' | 'text' | 'textDanger' | 'textSecondary';

export interface ButtonProps extends Props {
  theme?: ButtonTheme;
  disabled?: boolean;
  disabledTextColor?: string;
  loading?: boolean;
  loadingText?: string;
  block?: boolean;
  icon?: string | RenderFunc;
  iconSize?: NumberString;
  iconClassName?: string;
  iconPosition?: 'left' | 'right';
  loadingType?: LoadingType;
  text?: string;
}
