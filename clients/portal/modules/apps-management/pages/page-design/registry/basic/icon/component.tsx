import React, { ForwardedRef, forwardRef, useRef, useEffect } from 'react';

import Icon, { IconProps } from '@one-for-all/icon';
import { mergeRefs } from '@polyApi/utils';

interface Props extends IconProps {
  'data-node-key'?: string;
}

const Component = (props: Props, ref: ForwardedRef<SVGSVGElement>): JSX.Element => {
  const iconRef = useRef<SVGSVGElement>(null);
  const mergedRef = mergeRefs<SVGSVGElement>(ref, iconRef);
  const nodeKey = props['data-node-key'];

  useEffect(() => {
    iconRef.current?.setAttribute('data-node-key', nodeKey ?? '');
  }, [nodeKey]);

  return (
    <Icon ref={mergedRef} {...props} />
  );
};

export default forwardRef(Component);
