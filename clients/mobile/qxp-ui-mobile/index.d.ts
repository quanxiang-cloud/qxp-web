import { CSSProperties } from 'react';

export interface Props {
  className?: string,
  style?: CSSProperties
}

type RenderFunc = () => JSX.Element;
