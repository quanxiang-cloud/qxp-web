/**
 * feat: placeholder component used on canvas
 */
import React from 'react';
import { useCss } from 'react-use';
import cs from 'classnames';

import './index.scss';

type Props = {
  text?: boolean;
  width?: number,
  height?: number;
}

function Empty({ height, width }: Props): JSX.Element {
  const propsStyle = useCss({
    height: `${height}px`,
    width: `${width}px`,
  });

  const cls = cs('placeholder-field', propsStyle);

  return <div className={cls} />;
}

export default Empty;
