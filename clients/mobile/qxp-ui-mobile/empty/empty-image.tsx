import React from 'react';

import { getSizeStyle } from '../utils/format/unit';

import { EmptyImageProps } from './types';

const EmptyImage: React.FC<EmptyImageProps> = (props) => {
  const { src, size = '120px', className, style } = props;
  const _style = getSizeStyle(size, {
    ...(style || {}),
    background: `url("${src}") no-repeat center center`,
  });
  return <div className={className} style={_style} />;
};

export default EmptyImage;
