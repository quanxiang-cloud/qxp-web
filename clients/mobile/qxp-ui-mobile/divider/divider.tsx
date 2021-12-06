import React, { CSSProperties } from 'react';
import { DividerProps } from './types';
import { addUnit } from '@m/qxp-ui-mobile/utils/format/unit';

const Divider: React.FC<DividerProps> = (props) => {
  const { color = 'white', size = '100%', direction = 'horizontal', thickness = '1px' } = props;

  const style: CSSProperties = { backgroundColor: color };
  const _size = addUnit(size);
  const _thickness = addUnit(thickness);
  if (direction === 'horizontal') {
    style.height = _thickness;
    style.width = _size;
  } else {
    style.width = _thickness;
    style.height = _size;
  }

  return (
    <div className={props.className} style={{ ...style, ...(props.style || {}) }}/>
  );
};

export default Divider;
