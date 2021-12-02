import { EmptyImageProps } from './types';
import React from 'react';
import { getSizeStyle } from '@m/qxp-ui-mobile/utils/format/unit';

const EmptyImage: React.FC<EmptyImageProps> = (props) => {
  const { src, size = '120px', className, style } = props;
  const _style = getSizeStyle(size, {
    ...(style || {}),
    background: `url("${src}")`,
  });
  return <div className={className} style={_style} />;
};

export default EmptyImage;
