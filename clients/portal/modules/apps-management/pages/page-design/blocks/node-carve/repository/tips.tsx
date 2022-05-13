import React from 'react';

import Icon from '@one-for-all/icon';
import Tooltip from '@c/tooltip';

function Tips({
  position = 'top',
  label = '',
}: {
  position?: 'top' | 'left' | 'right' | 'bottom';
  label: string
}): JSX.Element {
  return (
    <Tooltip position={position} label={label}>
      <Icon name='info' />
    </Tooltip>
  );
}

export default Tips;
